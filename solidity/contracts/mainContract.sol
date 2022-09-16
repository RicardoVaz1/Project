// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "./merchantContract.sol";

contract MainContract {
    /* ========== OWNER ========== */
    address private owner_address;
    uint public RequiredNumberOfVotes;   // Number of Votes required for the MerchantContract to be approved

    function _onlyOwner() private view {
        require(msg.sender == owner_address, "Only Owner can call this function");
    }

    modifier onlyOwner() {
        _onlyOwner();
        _;
    }



    /* ========== MERCHANTs ========== */
    struct Merchant {
        MerchantContract merchantContract;   // buyers will be sending the money to this address
        string name;
        uint status_contract;                // 0: default, Merchant doesn't exist; 1: Merchant exist, but not approved; 2: Merchant exist and approved
        uint status_withdrawals;             // 0: Merchant withdrawals unpaused; 1: default, Merchant withdrawals paused;
        uint votes;
    }

    // MerchantContractAddress => Merchant
    mapping(address => Merchant) public merchants;


    struct Votes {
        bool voted;   // false: didn't vote; true: already voted
    }

    // msg.sender => (MerchantContractAddress => Votes)
    mapping(address => mapping(address => Votes)) saveVoters;



    /* ========== CONSTRUCTOR ========== */
     constructor() {
        owner_address = msg.sender;
        RequiredNumberOfVotes = 2;
    }



    /* ========== MERCHANT_CONTRACTs ========== */
    function getOwnerAddress() public view onlyOwner returns(address) {
        return owner_address;
    }

    function createMerchantContract(address payable MerchantWalletAddress, string memory MerchantName) public onlyOwner {
        MerchantContract merchantContract = new MerchantContract(MerchantWalletAddress, MerchantName, address(this));
        merchants[address(merchantContract)] = Merchant(merchantContract, MerchantName, 1, 1, 0);

        emit CreatedMerchantContract(address(merchantContract), MerchantWalletAddress, MerchantName);
    }

    function approveMerchantContract(address MerchantContractAddress) private {
        merchants[MerchantContractAddress].merchantContract.approveMerchant();
        merchants[MerchantContractAddress].status_contract = 2;
        merchants[MerchantContractAddress].status_withdrawals = 0;

        emit ApprovedMerchantContract(MerchantContractAddress, merchants[MerchantContractAddress].name, true);
    }

    function disapproveMerchantContract(address MerchantContractAddress) public onlyOwner {
        if(merchants[MerchantContractAddress].status_contract != 2) revert("This address isn't approved!");

        merchants[MerchantContractAddress].merchantContract.disapproveMerchant();
        merchants[MerchantContractAddress].status_contract = 1;
        merchants[MerchantContractAddress].status_withdrawals = 1;
        merchants[MerchantContractAddress].votes = 0;

        emit ApprovedMerchantContract(MerchantContractAddress, merchants[MerchantContractAddress].name, false);
    }

    function freezeWithdrawalsMerchantContract(address MerchantContractAddress) public onlyOwner {
        merchants[MerchantContractAddress].merchantContract.pauseWithdrawals();
        merchants[MerchantContractAddress].status_withdrawals = 1;

        emit PausedMerchantContract(MerchantContractAddress, true);
    }

    function unfreezeWithdrawalsMerchantContract(address MerchantContractAddress) public onlyOwner {
        merchants[MerchantContractAddress].merchantContract.unpauseWithdrawals();
        merchants[MerchantContractAddress].status_withdrawals = 0;

        emit PausedMerchantContract(MerchantContractAddress, false);
    }

    function getMerchantContractNumberOfVotes(address MerchantContractAddress) public view onlyOwner returns(uint) {
        return merchants[MerchantContractAddress].votes;
    }

    function getMerchantContractStatusContract(address MerchantContractAddress) public view onlyOwner returns(uint) {
        return merchants[MerchantContractAddress].status_contract;
    }

    function getMerchantContractStatusWithdrawals(address MerchantContractAddress) public view onlyOwner returns(uint) {
        return merchants[MerchantContractAddress].status_withdrawals;
    }

    function getRequiredNumberOfVotes() public view returns(uint) {
        return RequiredNumberOfVotes;
    }

    function changeRequiredNumberOfVotes(uint NumberOfVotes) public onlyOwner {
        RequiredNumberOfVotes = NumberOfVotes;
    }

    function voteNewMerchantContractApproval(address MerchantContractAddress) public {
        if(merchants[MerchantContractAddress].status_contract == 0) revert("Merchant doesn't exist!");
        // if(merchants[MerchantContractAddress].status_contract == 1) revert("Merchant exist but not approved!");
        if(merchants[MerchantContractAddress].status_contract == 2) revert("Merchant has already been approved!");

        if(saveVoters[msg.sender][MerchantContractAddress].voted == true) revert("This address has already voted in this MerchantContract!");

        merchants[MerchantContractAddress].votes += 1;

        saveVoters[msg.sender][MerchantContractAddress].voted = true;

        // Voter | MerchantContract
        emit VoteNewMerchantContract(msg.sender, MerchantContractAddress);

        if(merchants[MerchantContractAddress].votes > RequiredNumberOfVotes) approveMerchantContract(MerchantContractAddress);
    }



    /* ========== MERCHANTCONTRACTS EVENTS ========== */
    function eventsMerchantContracts(uint eventID, address MerchantContractAddress, uint256 Amount) public {
        if(merchants[msg.sender].status_contract != 2) revert("Merchant hasn't been approved!");

        if(eventID == 1) emit Withdrawal(MerchantContractAddress, Amount);
        if(eventID == 2) emit TopUpMyContract(MerchantContractAddress, Amount);
    }

    function eventsMerchantContracts2(uint eventID, address MerchantContractAddress, uint IDPurchase, uint Sells, uint Refunds) public {
        if(merchants[msg.sender].status_contract != 2) revert("Merchant hasn't been approved!");

        if(eventID == 1) emit Complete(MerchantContractAddress, IDPurchase);
        if(eventID == 2) emit Historic(MerchantContractAddress, Sells, Refunds);
    }

    function eventsMerchantContracts3(uint eventID, address MerchantContractAddress, uint IDPurchase, uint256 Date, address BuyerAddress, uint256 Amount, uint PurchaseStatus, uint EscrowTime) public {
        if(merchants[msg.sender].status_contract != 2) revert("Merchant hasn't been approved!");

        if(eventID == 1) emit CreatePurchase(MerchantContractAddress, IDPurchase, Date, Amount, EscrowTime, PurchaseStatus);
        if(eventID == 2) emit Buy(MerchantContractAddress, IDPurchase, Date, BuyerAddress, Amount, PurchaseStatus);
        if(eventID == 3) emit Refund(MerchantContractAddress, IDPurchase, Date, BuyerAddress, Amount, PurchaseStatus);
    }



    /* ========== EVENTS ========== */
    event CreatedMerchantContract(address MerchantContractAddress, address MerchantAddress, string MerchantName);
    event ApprovedMerchantContract(address MerchantContractAddress, string MerchantName, bool Approved); // true = approved; false = not approved
    event PausedMerchantContract(address MerchantContractAddress, bool Paused); // true = withdrawals paused; false = withdrawals unpaused
    event VoteNewMerchantContract(address Voter, address MerchantContractAddress);



    /* ========== MERCHANTCONTRACTS EVENTS ========== */
    event TopUpMyContract(address MerchantContractAddress, uint256 Amount);
    event Historic(address MerchantContractAddress, uint Sells, uint Refunds);

    // Purchase Flow
    event CreatePurchase(address MerchantContractAddress, uint IDPurchase, uint256 DateCreated, uint256 PurchaseAmount, uint EscrowTime, uint PurchaseStatus);
    event Buy(address MerchantContractAddress, uint IDPurchase, uint256 DateFinished, address BuyerAddress, uint256 PurchaseAmount, uint PurchaseStatus);
    event Complete(address MerchantContractAddress, uint IDPurchase);
    event Withdrawal(address MerchantContractAddress, uint256 Balance);
    event Refund(address MerchantContractAddress, uint IDPurchase, uint256 Date, address BuyerAddress, uint256 RefundAmount, uint PurchaseStatus);
}

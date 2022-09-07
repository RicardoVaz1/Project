// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "./merchantContract.sol";
// import "hardhat/console.sol";

contract MainContract {
    /* ========== SYSTEM ========== */
    address private owner_address;

    uint public RequiredNumberOfVotes; // Number of Votes required for the MerchantContract to be approved

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
        uint status_contract; // 0: default, Merchant doesn't exist; 1: Merchant exist, but not approved; 2: Merchant exist and approved
        uint status_withdrawals; // 0: Merchant withdrawals unpaused; 1: default, Merchant withdrawals paused;
        uint votes;
    }

    // uint public MerchantContractsCounter; // count the nº of Merchant Contracts

    // MerchantContractAddress => Merchant
    mapping(address => Merchant) public merchants;


    struct Votes {
        bool voted; // false: didn't vote; true: already voted
    }

    // msg.sender => (MerchantContractAddress => Votes)
    mapping(address => mapping(address => Votes)) saveVoters;



    /* ========== CONSTRUCTOR ========== */
     constructor() {
        owner_address = msg.sender;
        RequiredNumberOfVotes = 2;
        // MerchantContractsCounter = 0;
    }



    /* ========== MERCHANT_CONTRACTs ========== */
    function getOwnerAddress() public view onlyOwner returns(address) {
        // console.log("Owner Address: ", owner_address, "!!");
        return owner_address;
    }

    function createMerchantContract(address payable MerchantWalletAddress, string memory MerchantName) public onlyOwner {
        // Merchant { MerchantContract merchantContract, string name, uint status_contract, uint status_withdrawals, uint votes }
        MerchantContract merchantContract = new MerchantContract(MerchantWalletAddress, MerchantName, address(this));
        merchants[address(merchantContract)] = Merchant(merchantContract, MerchantName, 1, 1, 0);

        // console.log("Created new Merchant!");
        // console.log("MerchantContractAddress: ", address(merchantContract));
        // console.log("MerchantWalletAddress: ", MerchantWalletAddress);
        // console.log("MerchantName: ", MerchantName);

        // MerchantContractsCounter++;

        emit CreatedMerchantContract(address(merchantContract), MerchantWalletAddress, MerchantName);
    }

    function approveMerchantContract(address MerchantContractAddress) private {
        merchants[MerchantContractAddress].status_contract = 2;
        // console.log("MerchantContractAddress ", MerchantContractAddress, " has been approved!");
        merchants[MerchantContractAddress].merchantContract.approveMerchant();

        // unfreezeWithdrawalsMerchantContract(MerchantContractAddress);
        merchants[MerchantContractAddress].status_withdrawals = 0;

        emit ApprovedMerchantContract(MerchantContractAddress, merchants[MerchantContractAddress].name, true);
    }

    function disapproveMerchantContract(address MerchantContractAddress) public onlyOwner {
        if(merchants[MerchantContractAddress].status_contract != 2) revert("This address isn't approved!");

        merchants[MerchantContractAddress].merchantContract.disapproveMerchant();
        merchants[MerchantContractAddress].status_contract = 1;
        // console.log("MerchantContractAddress ", MerchantContractAddress, " has been disapproved!!");

        merchants[MerchantContractAddress].votes = 0;
        merchants[MerchantContractAddress].status_withdrawals = 1;

        emit ApprovedMerchantContract(MerchantContractAddress, merchants[MerchantContractAddress].name, false);
    }

    function freezeWithdrawalsMerchantContract(address MerchantContractAddress) public onlyOwner {
        merchants[MerchantContractAddress].status_withdrawals = 1;
        merchants[MerchantContractAddress].merchantContract.pauseWithdrawals();

        // console.log("MerchantContractAddress ", MerchantContractAddress, " has been paused!");
        emit PausedMerchantContract(MerchantContractAddress, true);
    }

    function unfreezeWithdrawalsMerchantContract(address MerchantContractAddress) public onlyOwner {
        merchants[MerchantContractAddress].status_withdrawals = 0;
        merchants[MerchantContractAddress].merchantContract.unpauseWithdrawals();

        // console.log("MerchantContractAddress ", MerchantContractAddress, " has been unpaused!");
        emit PausedMerchantContract(MerchantContractAddress, false);
    }

    function getMerchantContractNumberOfVotes(address MerchantContractAddress) public view onlyOwner returns(uint) {
        // console.log("MerchantContractAddress: ", MerchantContractAddress);
        // console.log("Number of Votes: ", merchants[MerchantContractAddress].votes);
        return merchants[MerchantContractAddress].votes;
    }

    function getMerchantContractStatusContract(address MerchantContractAddress) public view onlyOwner returns(uint) {
        // console.log("MerchantContractAddress: ", MerchantContractAddress);
        // console.log("Status Contract: ", merchants[MerchantContractAddress].status_contract);
        return merchants[MerchantContractAddress].status_contract;
    }

    function getMerchantContractStatusWithdrawals(address MerchantContractAddress) public view onlyOwner returns(uint) {
        // console.log("MerchantContractAddress: ", MerchantContractAddress);
        // console.log("Status Withdrawals: ", merchants[MerchantContractAddress].status_withdrawals);
        return merchants[MerchantContractAddress].status_withdrawals;
    }

    function getRequiredNumberOfVotes() public view returns(uint) {
        // console.log("Number of Votes: ", RequiredNumberOfVotes);
        return RequiredNumberOfVotes;
    }

    function changeRequiredNumberOfVotes(uint NumberOfVotes) public onlyOwner {
        RequiredNumberOfVotes = NumberOfVotes;
        // console.log("Number of Votes is: ", RequiredNumberOfVotes);
    }

    function voteNewMerchantContractApproval(address MerchantContractAddress) public {
        if(merchants[MerchantContractAddress].status_contract == 0) revert("Merchant doesn't exist!");
        // if(merchants[MerchantContractAddress].status_contract == 1) revert("Merchant exist but not approved!");
        if(merchants[MerchantContractAddress].status_contract == 2) revert("Merchant has already been approved!");

        if(saveVoters[msg.sender][MerchantContractAddress].voted == true) revert("This address has already voted in this MerchantContract!");

        merchants[MerchantContractAddress].votes += 1;

        saveVoters[msg.sender][MerchantContractAddress].voted = true;

        // console.log("AddressVoting: ", msg.sender);
        // console.log("MerchantContractAddress: ", MerchantContractAddress);
        // console.log("Total of Votes: ", merchants[MerchantContractAddress].votes);

        // Voter | MerchantContract
        emit VoteNewMerchantContract(msg.sender, MerchantContractAddress);

        if(merchants[MerchantContractAddress].votes > RequiredNumberOfVotes) {
            approveMerchantContract(MerchantContractAddress);
        }
    }



    /* ========== MERCHANTCONTRACTS EVENTS ========== */
    /* function eventsMerchantContracts(uint eventID, address MerchantContractAddress, bool Status) public {
        if(merchants[msg.sender].status_contract != 2) revert("Merchant hasn't been approved!");

        if(eventID == 1) emit ApprovedMerchant(MerchantContractAddress, Status);
        if(eventID == 2) emit PausedWithdrawal(MerchantContractAddress, Status);
    } */

    function eventsMerchantContracts2(uint eventID, address MerchantContractAddress, uint256 Amount) public {
        if(merchants[msg.sender].status_contract != 2) revert("Merchant hasn't been approved!");

        if(eventID == 1) emit Withdrawal(MerchantContractAddress, Amount);
        if(eventID == 2) emit TopUpMyContract(MerchantContractAddress, Amount);
    }

    function eventsMerchantContracts3(uint eventID, address MerchantContractAddress, uint IDPurchase, uint Sells, uint Refunds) public {
        if(merchants[msg.sender].status_contract != 2) revert("Merchant hasn't been approved!");

        if(eventID == 1) emit Complete(MerchantContractAddress, IDPurchase);
        if(eventID == 2) emit Historic(MerchantContractAddress, Sells, Refunds);
    }

    function eventsMerchantContracts4(uint eventID, address MerchantContractAddress, uint IDPurchase, uint256 Date, address BuyerAddress, uint256 Amount, uint PurchaseStatus, uint EscrowTime) public {
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
    // event ApprovedMerchant(address MerchantContractAddress, bool ApprovedMerchant); // true = approved; false = not approved
    // event PausedWithdrawal(address MerchantContractAddress, bool PausedWithdrawal); // true = withdrawals paused; false = withdrawals unpaused
    event TopUpMyContract(address MerchantContractAddress, uint256 Amount);
    event Historic(address MerchantContractAddress, uint Sells, uint Refunds);

    // Purchase Flow
    event CreatePurchase(address MerchantContractAddress, uint IDPurchase, uint256 DateCreated, uint256 PurchaseAmount, uint EscrowTime, uint PurchaseStatus);
    event Buy(address MerchantContractAddress, uint IDPurchase, uint256 DateFinished, address BuyerAddress, uint256 PurchaseAmount, uint PurchaseStatus);
    event Complete(address MerchantContractAddress, uint IDPurchase);
    event Withdrawal(address MerchantContractAddress, uint256 Balance);
    event Refund(address MerchantContractAddress, uint IDPurchase, uint256 Date, address BuyerAddress, uint256 RefundAmount, uint PurchaseStatus);
}

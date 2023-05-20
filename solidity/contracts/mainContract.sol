// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "./merchantContract.sol";

contract MainContract {
    /* ========== OWNER ========== */
    address private ownerAddress;
    uint public requiredNumberOfVotes;   // Number of Votes required for the MerchantContract to be approved

    modifier onlyOwner() {
        require(msg.sender == ownerAddress, "Only Owner can call this function");
        _;
    }

    modifier created(MerchantContract contractInstance) {
        require(merchants[contractInstance].status != 0, "This contractInstance isn't created!");
        _;
    }

    modifier approved(MerchantContract contractInstance) {
        require(merchants[contractInstance].status == 2, "Merchant isn't approved!");
        _;
    }



    /* ========== MERCHANTs ========== */
    struct Merchant {
        uint status;                // 0: default, Merchant doesn't exist; 1: Merchant exist, but not approved; 2: Merchant exist and approved; 3: Merchant paused; 4: Merchant unpaused
        uint votes;
        mapping(address => bool) voters;
    }

    mapping(MerchantContract => Merchant) public merchants;



    /* ========== BUYERS HISTORIC ========== */
    struct BuyersHistoric {
        uint Purchases;
        uint Cancellations;
    }

    // msg.sender => BuyersHistoric
    mapping(address => BuyersHistoric) private buyersHistoric;



    /* ========== CONSTRUCTOR ========== */
     constructor() {
        ownerAddress = msg.sender;
        requiredNumberOfVotes = 2;
    }



    /* ========== MERCHANTCONTRACT ========== */
    function createMerchantContract(address payable merchantWalletAddress, string memory merchantName) public onlyOwner {
        MerchantContract merchantContract = new MerchantContract(merchantWalletAddress, merchantName);
        merchants[merchantContract].status = 1;
        merchants[merchantContract].votes = 0;

        emit CreatedMerchantContract(merchantContract, merchantWalletAddress, merchantName);
    }

    function approve(MerchantContract contractInstance) private {
        contractInstance.approveMerchant();
        merchants[contractInstance].status = 2;

        emit ApprovedMerchantContract(contractInstance, true);
    }

    function pause(MerchantContract contractInstance) public onlyOwner created(contractInstance) {
        contractInstance.pauseMerchant();
        merchants[contractInstance].status = 3;

        emit PausedMerchantContract(contractInstance, true);
    }

    function unpause(MerchantContract contractInstance) public onlyOwner created(contractInstance) {
        contractInstance.unpauseMerchant();
        merchants[contractInstance].status = 4;

        emit PausedMerchantContract(contractInstance, false);
    }

    function getNumberOfVotes(MerchantContract contractInstance) public view onlyOwner created(contractInstance) returns(uint) {
        return merchants[contractInstance].votes;
    }

    function getStatusContract(MerchantContract contractInstance) public view onlyOwner created(contractInstance) returns(uint) {
        return merchants[contractInstance].status;
    }

    function getRequiredNumberOfVotes() public view returns(uint) {
        return requiredNumberOfVotes;
    }

    function setRequiredNumberOfVotes(uint numberOfVotes) public onlyOwner {
        requiredNumberOfVotes = numberOfVotes;
    }

    function voteApproval(MerchantContract contractInstance) public {
        Merchant storage merchant = merchants[contractInstance];
        require(merchant.status == 1, "Merchant doesn't exist or has already been approved!");
        require(merchant.voters[msg.sender] == false, "This address has already voted in this MerchantContract!");

        merchant.voters[msg.sender] = true;

        uint votePower = sqrt(buyersHistoric[msg.sender].Purchases) + sqrt(buyersHistoric[msg.sender].Cancellations);

        if(votePower > 0 && votePower <= 20) merchant.votes += votePower;
        else merchant.votes += 1;

        // Voter | MerchantContract
        emit VoteNewMerchantContract(msg.sender, contractInstance);

        if (merchant.votes >= requiredNumberOfVotes) approve(contractInstance);
    }

    function sqrt(uint x) private pure returns (uint y) {
        uint z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }



    /* ========== MERCHANTCONTRACT EVENTS ========== */
    function createPurchase(MerchantContract contractInstance, uint idPurchase, uint256 date, uint256 amount, uint purchaseStatus, uint cancelTime, uint completeTime) public approved(contractInstance) {
        emit CreatePurchase(contractInstance, idPurchase, date, amount, purchaseStatus, cancelTime, completeTime);
    }

    function buy(MerchantContract contractInstance, uint idPurchase, uint256 date, address buyerAddress, uint256 amount, uint purchaseStatus) public approved(contractInstance) {
        emit Buy(contractInstance, idPurchase, date, buyerAddress, amount, purchaseStatus);
    }

    function complete(MerchantContract contractInstance, uint idPurchase) public approved(contractInstance) {
        emit Complete(contractInstance, idPurchase);
    }

    function refund(MerchantContract contractInstance, uint idPurchase, uint256 date, address buyerAddress, uint256 amount, uint purchaseStatus) public approved(contractInstance) {
        emit Refund(contractInstance, idPurchase, date, buyerAddress, amount, purchaseStatus);
    }

    function withdrawal(MerchantContract contractInstance, uint256 amount) public approved(contractInstance) {
        emit Withdrawal(contractInstance, amount);
    }

    function historic(MerchantContract contractInstance, address buyerAddress, uint purchaseStatus) public approved(contractInstance) {
        if(purchaseStatus == 0) buyersHistoric[buyerAddress].Purchases += 1; // purchase completed
        else buyersHistoric[buyerAddress].Cancellations += 1; // purchase refunded or canceled
    }



    /* ========== EVENTS ========== */
    event CreatedMerchantContract(MerchantContract contractInstance, address merchantAddress, string merchantName);
    event ApprovedMerchantContract(MerchantContract contractInstance, bool approved); // true = approved; false = not approved
    event PausedMerchantContract(MerchantContract contractInstance, bool paused); // true = withdrawals paused; false = withdrawals unpaused
    event VoteNewMerchantContract(address voter, MerchantContract contractInstance);

    event CreatePurchase(MerchantContract contractInstance, uint idPurchase, uint256 dateCreated, uint256 purchaseAmount, uint purchaseStatus, uint cancelTime, uint completeTime);
    event Buy(MerchantContract contractInstance, uint idPurchase, uint256 dateFinished, address buyerAddress, uint256 purchaseAmount, uint purchaseStatus);
    event Complete(MerchantContract contractInstance, uint idPurchase);
    event Withdrawal(MerchantContract contractInstance, uint256 Balance);
    event Refund(MerchantContract contractInstance, uint idPurchase, uint256 date, address buyerAddress, uint256 refundAmount, uint purchaseStatus);
}

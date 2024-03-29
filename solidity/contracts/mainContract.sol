// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "./merchantContract.sol";

contract MainContract {
    /* ========== OWNER ========== */
    address public ownerAddress;
    uint public requiredNumberOfVotes;   // Number of votes required for the MerchantContract to be approved

    modifier onlyOwner() {
        require(msg.sender == ownerAddress, "Only Owner can call this function!");
        _;
    }

    modifier created(MerchantContract contractInstance) {
        require(merchants[contractInstance].status != 0, "This contract is not created!");
        _;
    }

    modifier approved(MerchantContract contractInstance) {
        require(merchants[contractInstance].status == 2, "Merchant is not approved!");
        _;
    }

    modifier paused(MerchantContract contractInstance) {
        require(merchants[contractInstance].status == 3, "Merchant is not paused!");
        _;
    }



    /* ========== MERCHANTS ========== */
    struct Merchant {
        uint status;    // 0: default, Merchant doesn't exist; 1: Merchant exist, but not approved; 2: Merchant exist and approved/unpaused; 3: Merchant paused
        uint votes;
        mapping(address => bool) voters;
    }

    mapping(MerchantContract => Merchant) public merchants;



    /* ========== BUYERS HISTORIC ========== */
    struct BuyersHistoric {
        uint purchases;
        uint cancellations;
    }

    // msg.sender => BuyersHistoric
    mapping(address => BuyersHistoric) private buyersHistoric;



    /* ========== CONSTRUCTOR ========== */
     constructor() {
        ownerAddress = msg.sender;
        requiredNumberOfVotes = 2;
    }

    receive() external payable approved(MerchantContract(msg.sender)) { }



    /* ========== MAINCONTRACT ========== */
    function getNumberOfVotes(MerchantContract contractInstance) public view onlyOwner created(contractInstance) returns(uint) {
        return merchants[contractInstance].votes;
    }

    function getStatusContract(MerchantContract contractInstance) public view onlyOwner created(contractInstance) returns(uint) {
        return merchants[contractInstance].status;
    }

    function setRequiredNumberOfVotes(uint numberOfVotes) public onlyOwner {
        requiredNumberOfVotes = numberOfVotes;
    }

    function transferRest() public onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "No balance available to transfer!");
        payable(ownerAddress).transfer(amount);
    }



    /* ========== MERCHANTCONTRACT ========== */
    function createMerchantContract(address payable merchantWalletAddress, string memory merchantName) public onlyOwner {
        MerchantContract merchantContract = new MerchantContract(merchantWalletAddress, merchantName);
        merchants[merchantContract].status = 1;
        merchants[merchantContract].votes = 0;

        emit CreateMerchantContract(merchantContract, merchantWalletAddress, merchantName);
    }

    function approve(MerchantContract contractInstance) private {
        contractInstance.approveMerchant();
        merchants[contractInstance].status = 2;

        emit ApproveMerchantContract(contractInstance);
    }

    function pause(MerchantContract contractInstance) public onlyOwner approved(contractInstance) {
        contractInstance.pauseMerchant();
        merchants[contractInstance].status = 3;

        emit PauseMerchantContract(contractInstance, true);
    }

    function unpause(MerchantContract contractInstance) public onlyOwner paused(contractInstance) {
        contractInstance.unpauseMerchant();
        merchants[contractInstance].status = 2;

        emit PauseMerchantContract(contractInstance, false);
    }

    function withdrawRest(MerchantContract contractInstance) public onlyOwner approved(contractInstance) {
        uint256 amount = contractInstance.withdrawRest();
        emit WithdrawRest(contractInstance, amount);
    }



    /* ========== MERCHANTS/BUYERS ========== */
    function voteApproval(MerchantContract contractInstance) public {
        Merchant storage merchant = merchants[contractInstance];
        require(merchant.status == 1, "Merchant does not exist or has already been approved!");
        require(merchant.voters[msg.sender] == false, "This address has already voted in this MerchantContract!");

        merchant.voters[msg.sender] = true;

        uint votePower = sqrt(buyersHistoric[msg.sender].purchases) + 1;
        merchant.votes += votePower > 20 ? 20 : votePower;

        // MerchantContract | Voter
        emit VoteNewMerchantContract(contractInstance, msg.sender);

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
    function createPurchase(uint idPurchase, uint256 amount, uint cancelTime, uint completeTime) public approved(MerchantContract(msg.sender)) {
        emit CreatePurchase(MerchantContract(msg.sender), idPurchase, amount, cancelTime, completeTime);
    }

    function buy(uint idPurchase, uint cancelTime, uint completeTime, address buyerAddress, uint256 amount) public approved(MerchantContract(msg.sender)) {
        buyersHistoric[buyerAddress].purchases += 1; // purchase completed
        emit Buy(MerchantContract(msg.sender), idPurchase, cancelTime, completeTime, buyerAddress, amount);
    }

    function complete(uint idPurchase) public approved(MerchantContract(msg.sender)) {
        emit Complete(MerchantContract(msg.sender), idPurchase);
    }

    function refund(uint idPurchase, address buyerAddress, uint256 amount) public approved(MerchantContract(msg.sender)) {
        buyersHistoric[buyerAddress].cancellations += 1; // purchase refunded
        emit Refund(MerchantContract(msg.sender), idPurchase, buyerAddress, amount);
    }

    function withdrawal(uint256 amount) public approved(MerchantContract(msg.sender)) {
        emit Withdrawal(MerchantContract(msg.sender), amount);
    }

    function cancel(address buyerAddress, uint idPurchase) public approved(MerchantContract(msg.sender)) {
        buyersHistoric[buyerAddress].cancellations += 1; // purchase canceled
        emit Cancel(MerchantContract(msg.sender), buyerAddress, idPurchase);
    }



    /* ========== EVENTS ========== */
    event CreateMerchantContract(MerchantContract contractInstance, address merchantAddress, string merchantName);
    event ApproveMerchantContract(MerchantContract contractInstance);
    event PauseMerchantContract(MerchantContract contractInstance, bool paused);
    event VoteNewMerchantContract(MerchantContract contractInstance, address voter);

    event CreatePurchase(MerchantContract contractInstance, uint idPurchase, uint256 purchaseAmount, uint cancelTime, uint completeTime);
    event Buy(MerchantContract contractInstance, uint idPurchase, uint cancelTime, uint completeTime, address buyerAddress, uint256 purchaseAmount);
    event Complete(MerchantContract contractInstance, uint idPurchase);
    event Withdrawal(MerchantContract contractInstance, uint256 merchantBalance);
    event Refund(MerchantContract contractInstance, uint idPurchase, address buyerAddress, uint256 refundAmount);
    event Cancel(MerchantContract contractInstance, address buyerAddress, uint idPurchase);
    event WithdrawRest(MerchantContract contractInstance, uint256 restBalance);
}

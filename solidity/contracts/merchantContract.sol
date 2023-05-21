// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "./mainContract.sol";

contract MerchantContract {
    /* ========== OWNER ========== */
    MainContract public mainContract;
    address private ownerAddress;
    bool public approved;   // true = approved; false = not approved
    bool public paused;     // true = withdrawals paused; false = withdrawals unpaused

    modifier onlyOwner() {
        require(msg.sender == ownerAddress, "Only Owner can call this function");
        _;
    }

    modifier approvedMerchant() {
        require(approved == true, "Merchant isn't approved!");
        _;
    }

    modifier unpausedMerchant() {
        require(paused == false, "Merchant is paused!");
        _;
    }



    /* ========== MERCHANT ========== */
    address payable private merchantAddress;   // buyers will be sending the money to MerchantContract and then the money will be sent to this address
    string public name;
    uint256 private totalEscrowAmount;         // total amount in escrow
    uint256 private balance;                   // amount verified and ready to withdrawal

    modifier onlyMerchant() {
        require(msg.sender == merchantAddress, "Only Merchant can call this function");
        _;
    }



    /* ========== PURCHASEs ========== */
    struct Purchase {
        uint256 dateF;
        uint256 amount;
        uint status;             // 0: default, purchase isn't created; 1: purchase created, but not paid; 2: purchase created and paid; 3: purchase completed; 4: purchase refunded; 5: purchase canceled
        uint256 escrowAmount;    // amount waiting for completeTime to end to be added to balance
        uint cancelTime;         // time the buyer has to cancel the purchase
        uint completeTime;       // time the merchant has to wait, for the money to be sent to his wallet
        address payable buyerAddress;
    }

    // idPurchase => Purchase
    mapping(uint => Purchase) public purchases;



    /* ========== CONSTRUCTOR ========== */
    constructor(address payable _merchantAddress, string memory _merchantName) {
        merchantAddress = _merchantAddress;
        name = _merchantName;
        mainContract = MainContract(msg.sender);
        ownerAddress = msg.sender;

        totalEscrowAmount = 0;
        balance = 0;
        approved = false;
        paused = true;
    }



    /* ========== OWNER ========== */
    function approveMerchant() public onlyOwner {
        approved = true;
        paused = false;
    }

    function pauseMerchant() public onlyOwner {
        paused = true;
    }

    function unpauseMerchant() public onlyOwner {
        paused = false;
    }



    /* ========== MERCHANTs ========== */
    function setAddress(address payable newAddress) public onlyMerchant approvedMerchant unpausedMerchant {
        merchantAddress = newAddress;
    }

    function getName() public view approvedMerchant returns(string memory) {
        return name;
    }

    function getTotalEscrowAmount() public view onlyMerchant approvedMerchant returns(uint256) {
        return totalEscrowAmount;
    }

    function getBalance() public view onlyMerchant approvedMerchant returns(uint256) {
        return balance;
    }

    function purchaseStatus(uint idPurchase) public view approvedMerchant returns(uint) {
        return purchases[idPurchase].status;
    }

    function createPurchase(uint idPurchase, uint256 purchaseAmount, uint cancelTime, uint completeTime) public onlyMerchant approvedMerchant unpausedMerchant {
        purchases[idPurchase] = Purchase(block.timestamp, purchaseAmount, 1, 0, cancelTime, completeTime, payable(address(this)));

        // From | IDPurchase | DateCreated | PurchaseAmount | PurchaseStatus | CancelTime | CompleteTime
        mainContract.createPurchase(this, idPurchase, block.timestamp, purchaseAmount, 1, cancelTime, completeTime);
    }

    function complete(uint idPurchase) public onlyMerchant approvedMerchant unpausedMerchant {
        Purchase storage purchase = purchases[idPurchase];
        require(purchase.dateF < block.timestamp, "The escrow time of this purchase isn't over yet!");
        require(purchase.status == 2, "Purchase must be in payed state!");

        totalEscrowAmount -= purchase.amount;
        purchase.escrowAmount -= purchase.amount;
        balance += purchase.amount;
        purchase.status = 3; // Purchase completed

        // MerchantContract | IDPurchase
        mainContract.complete(this, idPurchase);
    }

    function withdrawal() public onlyMerchant approvedMerchant unpausedMerchant {
        require(balance > 0, "Balance should be greater than 0!!");
        merchantAddress.transfer(balance);

        // From | Balance
        mainContract.withdrawal(this, balance);
        balance = 0;
    }

    function refund(uint idPurchase, uint256 refundAmount) public onlyMerchant approvedMerchant unpausedMerchant {
        Purchase storage purchase = purchases[idPurchase];
        require(refundAmount > 0, "Refund amount should be greater than 0!!");
        require(refundAmount <= purchase.amount, "Refund amount shouldn't be greater than the purchaseAmount!");
        require(purchase.status == 2, "Purchase must be in payed state!");

        if(refundAmount == purchase.amount) {
            // Full Refund 
            purchase.buyerAddress.transfer(refundAmount);
            totalEscrowAmount -= purchase.amount;
        } else {
            // Partial Refund 
            purchase.buyerAddress.transfer(refundAmount);
            balance += purchase.amount - refundAmount;
            totalEscrowAmount -= purchase.amount;
        }

        purchase.status = 4; // Purchase refunded

        // From | IDPurchase | Date | To | RefundAmount | PurchaseStatus
        mainContract.refund(this, idPurchase, block.timestamp, purchase.buyerAddress, refundAmount, 4);

        // MerchantContract | BuyerAddress | PurchaseStatus
        mainContract.historic(this, purchase.buyerAddress, 1);
    }



    /* ========== BUYERS ========== */
    function buy(uint idPurchase) external payable approvedMerchant unpausedMerchant {
        Purchase storage purchase = purchases[idPurchase];
        require(msg.value > 0, "Amount should be greater than 0!");
        require(msg.value == purchase.amount, "Wrong amount!");
        require(purchase.status == 1, "Purchase must exist and hasn't yet been paid!");

        totalEscrowAmount += msg.value;
        purchase.dateF = block.timestamp + purchase.completeTime;
        purchase.status = 2;
        purchase.escrowAmount = msg.value;
        purchase.buyerAddress = payable(msg.sender);

        // From | IDPurchase | DateFinished | To | PurchaseAmount | PurchaseStatus
        mainContract.buy(this, idPurchase, purchase.dateF, msg.sender, msg.value, 2);

        // MerchantContract | BuyerAddress | PurchaseStatus
        mainContract.historic(this, msg.sender, 0);
    }

    function cancel(uint idPurchase) public approvedMerchant unpausedMerchant {
        Purchase storage purchase = purchases[idPurchase];
        require(purchase.cancelTime > block.timestamp, "The cancel time of this purchase is over!");
        require(purchase.buyerAddress == msg.sender, "The buyer address must be the same!");

        purchase.buyerAddress.transfer(purchase.amount);
        totalEscrowAmount -= purchase.amount;
        purchase.status = 5; // Purchase canceled

        // MerchantContract | BuyerAddress | PurchaseStatus
        mainContract.historic(this, purchase.buyerAddress, 1);
    }
}

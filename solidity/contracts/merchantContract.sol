// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "./mainContract.sol";

contract MerchantContract {
    /* ========== OWNER ========== */
    MainContract public mainContract;
    uint public status;    // 0: default, Merchant doesn't exist; 1: Merchant exist, but not approved; 2: Merchant exist and approved/unpaused; 3: Merchant paused

    modifier onlyOwner() {
        require(msg.sender == address(mainContract), "Only Owner can call this function!");
        _;
    }

    modifier running() {
        require(status == 2, "Merchant is not accepting operations!");
        _;
    }



    /* ========== MERCHANT ========== */
    address payable public merchantAddress;   // buyers will be sending the money to MerchantContract and then the money will be sent to this address
    string public name;
    uint256 private totalEscrowAmount;         // total amount in escrow
    uint256 private merchantBalance;           // amount verified and ready to withdrawal

    modifier onlyMerchant() {
        require(msg.sender == merchantAddress, "Only Merchant can call this function!");
        _;
    }



    /* ========== PURCHASEs ========== */
    struct Purchase {
        uint256 amount;
        uint status;             // 0: default, purchase isn't created; 1: purchase created, but not paid; 2: purchase created and paid; 3: purchase completed; 4: purchase refunded; 5: purchase canceled
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
        mainContract = MainContract(payable(msg.sender));

        totalEscrowAmount = 0;
        merchantBalance = 0;
        status = 1;
    }



    /* ========== MAINCONTRACT ========== */
    function approveMerchant() public onlyOwner {
        status = 2;
    }

    function pauseMerchant() public onlyOwner {
        status = 3;
    }

    function unpauseMerchant() public onlyOwner {
        status = 2;
    }

    function withdrawRest() public onlyOwner() returns(uint256) {
        uint256 amount = address(this).balance - (merchantBalance + totalEscrowAmount);
        require(amount > 0, "No balance available to withdraw!");
        payable(mainContract).transfer(amount);
        return amount;
    }



    /* ========== MERCHANT ========== */
    function setAddress(address payable newAddress) public onlyMerchant {
        merchantAddress = newAddress;
    }

    function getName() public view returns(string memory) {
        return name;
    }

    function getTotalEscrowAmount() public view onlyMerchant returns(uint256) {
        return totalEscrowAmount;
    }

    function getBalance() public view onlyMerchant returns(uint256) {
        return merchantBalance;
    }

    function purchaseStatus(uint idPurchase) public view returns(uint) {
        return purchases[idPurchase].status;
    }

    function createPurchase(uint idPurchase, uint256 purchaseAmount, uint cancelTime, uint completeTime) public onlyMerchant running {
        Purchase storage purchase = purchases[idPurchase];
        require(purchase.status == 0, "Purchase must be in not created state!");

        purchases[idPurchase] = Purchase(purchaseAmount, 1, cancelTime, completeTime, payable(0));

        // IDPurchase | PurchaseAmount | CancelTime | CompleteTime
        mainContract.createPurchase(idPurchase, purchaseAmount, cancelTime, completeTime);
    }

    function complete(uint idPurchase) public onlyMerchant running {
        Purchase storage purchase = purchases[idPurchase];
        require(purchase.status == 2, "Purchase must be in payed state!");
        require(purchase.completeTime < block.timestamp, "The escrow time of this purchase is not over yet!");

        totalEscrowAmount -= purchase.amount;
        merchantBalance += purchase.amount;
        purchase.status = 3; // Purchase completed

        mainContract.complete(idPurchase);
    }

    function withdrawal() public onlyMerchant running {
        require(merchantBalance > 0, "Balance should be greater than 0!");
        merchantAddress.transfer(merchantBalance);

        mainContract.withdrawal(merchantBalance);
        merchantBalance = 0;
    }

    function refund(uint idPurchase, uint256 refundAmount) public onlyMerchant running {
        Purchase storage purchase = purchases[idPurchase];
        require(purchase.status == 2, "Purchase must be in payed state!");
        require(refundAmount > 0, "Refund amount should be greater than 0!");
        require(refundAmount <= purchase.amount, "Refund amount should not be greater than the purchase amount!");

        if(refundAmount == purchase.amount) {
            // Full Refund 
            purchase.buyerAddress.transfer(refundAmount);
            totalEscrowAmount -= purchase.amount;
        } else {
            // Partial Refund 
            purchase.buyerAddress.transfer(refundAmount);
            merchantBalance += purchase.amount - refundAmount;
            totalEscrowAmount -= purchase.amount;
        }

        purchase.status = 4; // Purchase refunded

        // IDPurchase | To | RefundAmount
        mainContract.refund(idPurchase, purchase.buyerAddress, refundAmount);
    }



    /* ========== BUYERS ========== */
    function buy(uint idPurchase) external payable running {
        Purchase storage purchase = purchases[idPurchase];
        require(purchase.status == 1, "Purchase must exist and has not yet been paid!");
        require(msg.value > 0, "Amount should be greater than 0!");
        require(msg.value == purchase.amount, "Wrong amount!");

        totalEscrowAmount += msg.value;
        purchase.status = 2;
        purchase.cancelTime += block.timestamp;
        purchase.completeTime += block.timestamp;
        purchase.buyerAddress = payable(msg.sender);

        // IDPurchase | CancelTime | CompleteTime | From | PurchaseAmount
        mainContract.buy(idPurchase, purchase.cancelTime, purchase.completeTime, msg.sender, msg.value);
    }

    function cancel(uint idPurchase) public running {
        Purchase storage purchase = purchases[idPurchase];
        require(purchase.status == 2, "Purchase must be in payed state!");
        require(purchase.buyerAddress == msg.sender, "The buyer address must be the same!");
        require(purchase.cancelTime > block.timestamp, "The cancel time of this purchase is over!");

        purchase.buyerAddress.transfer(purchase.amount);
        totalEscrowAmount -= purchase.amount;
        purchase.status = 5; // Purchase canceled

        // To | IDPurchase
        mainContract.cancel(purchase.buyerAddress, idPurchase);
    }
}

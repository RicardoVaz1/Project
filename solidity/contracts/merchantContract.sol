// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./mainContract.sol";

contract MerchantContract is Ownable {
    /* ========== OWNER ========== */
    MainContract public mainContract;
    bool public approved;   // true = approved; false = not approved
    bool public paused;     // true = withdrawals paused; false = withdrawals unpaused

    function _approvedMerchant() private view {
        require(approved == true, "Merchant not approved!");
    }

    function _pausedWithdrawals() private view {
        require(paused == false, "Withdrawals are paused!");
    }

    modifier approvedMerchant() {
        _approvedMerchant();
        _;
    }

    modifier pausedWithdrawals() {
        _pausedWithdrawals();
        _;
    }



    /* ========== MERCHANT ========== */
    address payable private merchant_address;   // buyers will be sending the money to merchantContract_address and then the money will be sent to this address
    string public name;
    uint256 private total_escrow_amount;        // total amount in escrow
    uint256 private balance;                    // amount verified and ready to withdrawal

    function _onlyMerchant() private view {
        require(msg.sender == merchant_address, "Only Merchant can call this function");
    }

    modifier onlyMerchant() {
        _onlyMerchant();
        _;
    }



    /* ========== PURCHASEs ========== */
    struct Purchase {
        uint256 dateF;
        uint256 amount;
        uint status;             // 0: default, purchase isn't created; 1: purchase created, but not paid; 2: purchase created and paid; 3: purchase completed; 4: purchase refunded
        uint256 escrow_amount;   // amount waiting for escrow_time to end to be added to balance
        uint escrow_time;        // time the merchant has to wait, for the money to be sent to his wallet
    }

    // idPurchase => Purchase
    mapping(uint => Purchase) public purchases;



    /* ========== HISTORICs ========== */
    struct MerchantHistoric {
        uint Sells;
        uint Refunds;
    }

    // merchant_address => MerchantHistoric
    mapping(address => MerchantHistoric) private merchantHistoric;


    struct BuyersHistoric {
        uint Purchases;
        uint Cancellations;
    }

    // msg.sender => BuyersHistoric
    mapping(address => BuyersHistoric) private buyersHistoric;



    /* ========== CONSTRUCTOR ========== */
    constructor(address payable MerchantAddress, string memory MerchantName, address MainContractAddress) {
        merchant_address = MerchantAddress;
        name = MerchantName;
        mainContract = MainContract(MainContractAddress);

        total_escrow_amount = 0;
        balance = 0;
        approved = false;
        paused = true;
    }



    /* ========== OWNER ========== */
    function getOwnerAddress() public view onlyOwner returns(address) {
        address owner_address = owner();
        return owner_address;
    }

    function approveMerchant() public onlyOwner {
        approved = true;
        paused = false;
    }

    function disapproveMerchant() public onlyOwner {
        approved = false;
        paused = true;
    }

    function pauseWithdrawals() public onlyOwner {
        paused = true;
    }

    function unpauseWithdrawals() public onlyOwner {
        paused = false;
    }



    /* ========== MERCHANTs ========== */
    function checkMyAddress() public view onlyMerchant approvedMerchant returns(address) {
        return merchant_address;
    }

    function changeMyAddress(address payable NewAddress) public onlyMerchant approvedMerchant {
        merchant_address = NewAddress;
    }

    function checkMyName() public view onlyMerchant approvedMerchant returns(string memory) {
        return name;
    }

    function checkMyEscrowAmount() public view onlyMerchant approvedMerchant returns(uint256) {
        return total_escrow_amount;
    }

    function checkMyBalance() public view onlyMerchant approvedMerchant returns(uint256) {
        return balance;
    }

    function getPurchaseStatus(uint idPurchase) public view approvedMerchant returns(uint) {
        return purchases[idPurchase].status;
    }

    function createPurchase(uint idPurchase, uint256 purchaseAmount, uint escrowTime) public onlyMerchant approvedMerchant {
        purchases[idPurchase] = Purchase(block.timestamp, purchaseAmount, 1, 0, escrowTime);

        // EventID | From | IDPurchase | DateCreated | [BuyerAddress] | PurchaseAmount | PurchaseStatus | EscrowTime
        mainContract.eventsMerchantContracts3(1, address(this), idPurchase, block.timestamp, address(this), purchaseAmount, 1, escrowTime);
    }

    function complete(uint idPurchase) public onlyMerchant approvedMerchant {
        require(purchases[idPurchase].dateF < block.timestamp, "The escrow time of this purchase isn't over yet!");
    
        if(purchases[idPurchase].status == 0) revert("That purchase doesn't exist!");
        if(purchases[idPurchase].status == 1) revert("That purchase hasn't yet been paid!");
        // if(purchases[idPurchase].status == 2) revert("That purchase has already been paid!");
        if(purchases[idPurchase].status == 3) revert("That purchase has already been completed!");
        if(purchases[idPurchase].status == 4) revert("That purchase has already been refunded!");

        total_escrow_amount -= purchases[idPurchase].amount;
        purchases[idPurchase].escrow_amount -= purchases[idPurchase].amount;
        balance += purchases[idPurchase].amount;
        purchases[idPurchase].status = 3; // Purchase completed

        // EventID | MerchantContractAddress | IDPurchase | [Sells] | [Refunds]
        mainContract.eventsMerchantContracts2(1, address(this), idPurchase, 0, 0);
    }

    function withdrawal() public onlyMerchant pausedWithdrawals approvedMerchant {
        require(balance > 0, "Balance should be greater than 0!!");
        merchant_address.transfer(balance);

        // EventID | From | Balance
        mainContract.eventsMerchantContracts(1, address(this), balance);
        balance = 0;
    }

    function refund(uint idPurchase, address payable BuyerAddress, uint256 refundAmount) public onlyMerchant pausedWithdrawals approvedMerchant {
        require(refundAmount > 0, "Refund amount should be greater than 0!!");
        require(refundAmount <= purchases[idPurchase].amount, "Refund amount shouldn't be greater than the purchaseAmount!");

        if(purchases[idPurchase].status == 0) revert("That purchase doesn't exist!"); // By default status is 0
        if(purchases[idPurchase].status == 1) revert("That purchase hasn't yet been paid!");
        // if(purchases[idPurchase].status == 2) revert("That purchase has already been paid!");
        // if(purchases[idPurchase].status == 3) revert("That purchase has already been completed!");
        if(purchases[idPurchase].status == 4) revert("That purchase has already been refunded!");

        if(total_escrow_amount+balance < refundAmount) revert("You don't have enough money in the smart-contract!");

        if(purchases[idPurchase].escrow_amount >= refundAmount) {
            purchases[idPurchase].escrow_amount -= refundAmount;
            total_escrow_amount -= refundAmount;
        }
        else if(balance >= refundAmount) {
            balance -= refundAmount;
        }
        else revert("Error processing refund, check your smart-contract balance!");

        BuyerAddress.transfer(refundAmount);
        purchases[idPurchase].status = 4; // Purchase refunded
        historic(BuyerAddress, 1);

        // EventID | From | IDPurchase | Date | To | RefundAmount | PurchaseStatus | [EscrowTime]
        mainContract.eventsMerchantContracts3(3, address(this), idPurchase, block.timestamp, BuyerAddress, refundAmount, 4, 0);
    }

    function topUpMyContract() external payable onlyMerchant approvedMerchant {
        if(msg.value == 0) revert("Amount should be greater than 0!");
        balance += msg.value;

        // EventID | To | Amount
        mainContract.eventsMerchantContracts(2, address(this), msg.value);
    }



    /* ========== BUYERs ========== */
    function buy(uint idPurchase) external payable approvedMerchant {
        if(msg.value == 0) revert("Amount should be greater than 0!");

        if(purchases[idPurchase].status == 0) revert("That purchase doesn't exist!");
        // if(purchases[idPurchase].status == 1) revert("That purchase hasn't yet been paid!");
        if(purchases[idPurchase].status == 2) revert("That purchase has already been paid!");
        if(purchases[idPurchase].status == 3) revert("That purchase has already been completed!");
        if(purchases[idPurchase].status == 4) revert("That purchase has already been refunded!");
        if(msg.value != purchases[idPurchase].amount) revert("Wrong amount!");

        total_escrow_amount += msg.value;
        purchases[idPurchase].dateF = block.timestamp + purchases[idPurchase].escrow_time;
        purchases[idPurchase].status = 2;
        purchases[idPurchase].escrow_amount = msg.value;
        historic(msg.sender, 0);

        // EventID | From | IDPurchase | DateFinished | To | PurchaseAmount | PurchaseStatus | [EscrowTime]
        mainContract.eventsMerchantContracts3(2, address(this), idPurchase, purchases[idPurchase].dateF, msg.sender, msg.value, 2, 0);
    }



    /* ========== HISTORICs ========== */
    function historic(address BuyerAddress, uint purchaseStatus) private {
        if(purchaseStatus == 0) {
            // purchase completed
            merchantHistoric[merchant_address].Sells += 1;
            buyersHistoric[BuyerAddress].Purchases += 1;
        }
        else {
            // purchase refunded
            merchantHistoric[merchant_address].Refunds += 1;
            buyersHistoric[BuyerAddress].Cancellations += 1;
        }

        // EventID | MerchantContractAddress | [IDPurchase] | MerchantSells | MerchantRefunds
        mainContract.eventsMerchantContracts2(2, address(this), 0, merchantHistoric[merchant_address].Sells, merchantHistoric[merchant_address].Refunds);
    }
}

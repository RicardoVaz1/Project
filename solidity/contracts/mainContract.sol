// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "./merchantContract.sol";
import "hardhat/console.sol";

contract MainContract {
    /* ========== SYSTEM ========== */
    address private owner_address;

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
        uint status; // 0: default, Merchant doesn't exist; 1: Merchant exist, but not approved; 2: Merchant exist and approved
        uint votes;
    }

    uint public MerchantContractsCounter; // count the nº of Merchant Contracts

    // MerchantContractAddress => Merchant
    mapping(address => Merchant) public merchants;


    // Historic
    struct MerchantHistoric {
        uint Sells;
        uint Refunds;
    }

    // MerchantAddress => MerchantHistoric
    mapping(address => MerchantHistoric) public merchantHistoric;


    struct BuyersHistoric {
        uint Purchases;
        uint Cancellations;
    }

    // BuyerAddress => BuyersHistoric
    mapping(address => BuyersHistoric) public buyersHistoric;



    /* ========== CONSTRUCTOR ========== */
     constructor() {
        owner_address = msg.sender;
        MerchantContractsCounter = 0;
    }

    // constructor(address OWNER) {
    //     owner_address = OWNER;
    //     MerchantContractsCounter = 0;
    // }



    /* ========== MERCHANT_CONTRACTs ========== */
    function getOwnerAddress() public view onlyOwner returns(address) {
        console.log("Owner Address: ", owner_address, "!!");
        return owner_address;
    }

    function getMerchantWalletAddress(address MerchantContractAddress) public view onlyOwner returns(address) {
        // This function it is being used for testing only
        address MerchantWalletAddress = merchants[MerchantContractAddress].merchantContract.getMerchantWalletAddress();
        console.log("MerchantWalletAddress: ", MerchantWalletAddress, "!!");
        return MerchantWalletAddress;
    }

    function saveHistoric(address MerchantAddress, address BuyerAddress, uint PurchaseStatus) public {
        if(merchants[msg.sender].status != 2) revert("This address isn't approved!");

        if(PurchaseStatus == 0) {
            // purchase completed
            merchantHistoric[MerchantAddress].Sells += 1;
            buyersHistoric[BuyerAddress].Purchases += 1;
        }
        else {
            // purchase refunded
            merchantHistoric[MerchantAddress].Refunds += 1;
            buyersHistoric[BuyerAddress].Cancellations += 1;
        }

        // MerchantContractAddress | MerchantSells | MerchantRefunds | BuyerPurchases | BuyerCancellations
        emit SaveHistoric(msg.sender, merchantHistoric[MerchantAddress].Sells, merchantHistoric[MerchantAddress].Refunds, buyersHistoric[BuyerAddress].Purchases, buyersHistoric[BuyerAddress].Cancellations);
    }



    /* ========== EVENTS ========== */
    event SaveHistoric(address MerchantContractAddress, uint Sells, uint Refunds, uint Purchases, uint Cancellations);
}

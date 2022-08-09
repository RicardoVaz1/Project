// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "./merchantContract.sol";
import "hardhat/console.sol";

contract MainContract {
    /* ========== SYSTEM ========== */
    address private owner_address;

    modifier onlyOwner() {
        require(msg.sender == owner_address, "Only Owner can call this function");
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


    struct Votes {
        bool voted; // false: didn't vote; true: already voted
    }

    // msg.sender => (MerchantContractAddress => Votes)
    mapping(address => mapping(address => Votes)) saveVoters;

    // Historic
    struct MerchantHistoric {
        uint Sells;
        uint Refunds;
    }

    // MerchantAddress => MerchantHistoric
    mapping(address => MerchantHistoric) private merchantHistoric;


    struct BuyersHistoric {
        uint Purchases;
        uint Cancellations;
    }

    // BuyerAddress => BuyersHistoric
    mapping(address => BuyersHistoric) private buyersHistoric;



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

    /* function getMerchantContractAddress(address MerchantWalletAddress) public view onlyOwner returns(address) {
        address MerchantContractAddress = merchants[MerchantContractAddress].merchantContract.getMerchantWalletAddress();
        console.log("MerchantContractAddress: ", MerchantContractAddress);
        return MerchantContractAddress;
    } */

    function getMerchantWalletAddress(address MerchantContractAddress) public view onlyOwner returns(address) {
        // This function it is being used for testing only
        address MerchantWalletAddress = merchants[MerchantContractAddress].merchantContract.getMerchantWalletAddress();
        console.log("MerchantWalletAddress: ", MerchantWalletAddress, "!!");
        return MerchantWalletAddress;
    }

    function addMerchantContract(address payable MerchantWalletAddress, string memory MerchantName) public onlyOwner {
        // Merchant { MerchantContract merchantContract, string name, uint status, uint votes }
        MerchantContract merchantContract = new MerchantContract(MerchantWalletAddress, MerchantName);
        merchants[address(merchantContract)] = Merchant(merchantContract, MerchantName, 1, 0);

        console.log("Created new Merchant!");
        console.log("MerchantContractAddress: ", address(merchantContract));
        console.log("MerchantWalletAddress: ", MerchantWalletAddress);
        console.log("MerchantName: ", MerchantName);

        MerchantContractsCounter++;

        emit CreateMerchantContract(address(merchantContract), MerchantWalletAddress, MerchantName);
    }

    function approveMerchantContract(address MerchantContractAddress) private {
        merchants[MerchantContractAddress].merchantContract.approveMerchant();

        console.log("MerchantContractAddress ", MerchantContractAddress, " hes been approved!!");
        emit ApprovedMerchantContract(MerchantContractAddress, true);
    }

    function disapproveMerchantContract(address MerchantContractAddress) public onlyOwner {
        if(merchants[MerchantContractAddress].status != 2) revert("This address isn't approved!");

        merchants[MerchantContractAddress].status = 1;
        merchants[MerchantContractAddress].merchantContract.disapproveMerchant();

        console.log("MerchantContractAddress ", MerchantContractAddress, " has been disapproved!!");
        emit ApprovedMerchantContract(MerchantContractAddress, false);
    }

    function freezeWithdrawalsMerchantContract(address MerchantContractAddress) public onlyOwner {
        merchants[MerchantContractAddress].merchantContract.pauseWithdrawals();

        console.log("MerchantContractAddress ", MerchantContractAddress, " has been paused!");
        emit PausedMerchantContract(MerchantContractAddress, true);
    }

    function unfreezeWithdrawalsMerchantContract(address MerchantContractAddress) public onlyOwner {
        merchants[MerchantContractAddress].merchantContract.unpauseWithdrawals();

        console.log("MerchantContractAddress ", MerchantContractAddress, " has been unpaused!");
        emit PausedMerchantContract(MerchantContractAddress, false);
    }

    function voteNewMerchantContractApproval(address MerchantContractAddress) public {
        if(merchants[MerchantContractAddress].status == 0) revert("Merchant doesn't exist!");
        // if(merchants[MerchantContractAddress].status == 1) revert("Merchant exist but not approved!");
        if(merchants[MerchantContractAddress].status == 2) revert("Merchant has already been approved!");

        if(saveVoters[msg.sender][MerchantContractAddress].voted == true) revert("This address has already voted in this MerchantContract!");

        uint MerchantVotingPower = sqrt(merchantHistoric[msg.sender].Sells) - merchantHistoric[msg.sender].Refunds;
        uint BuyerVotingPower = sqrt(buyersHistoric[msg.sender].Purchases) - buyersHistoric[msg.sender].Cancellations;

        if(MerchantVotingPower != 0) {
            if(MerchantVotingPower <= 10) merchants[MerchantContractAddress].votes += MerchantVotingPower;
            else merchants[MerchantContractAddress].votes += 100;
        }
        // else merchants[MerchantContractAddress].votes += 1;

        if(BuyerVotingPower != 0) {
            if(BuyerVotingPower <= 10) merchants[MerchantContractAddress].votes += BuyerVotingPower;
            else merchants[MerchantContractAddress].votes += 100;
        }
        // else merchants[MerchantContractAddress].votes += 1;

        saveVoters[msg.sender][MerchantContractAddress].voted = true;

        console.log("AddressVoting: ", msg.sender);
        console.log("MerchantContractAddress: ", MerchantContractAddress);
        console.log("Total of Votes: ", merchants[MerchantContractAddress].votes);

        // Voter | MerchantContract
        emit VoteNewMerchantContractApproval(msg.sender, MerchantContractAddress);

        if(merchants[MerchantContractAddress].votes > 5000) {
            merchants[MerchantContractAddress].status = 2;
            console.log("MerchantContractAddress ", MerchantContractAddress, " has been approved!");

            approveMerchantContract(MerchantContractAddress);

            // NewMerchantContractApproved
            emit NewMerchantContractApproved(MerchantContractAddress);
        }
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

    function sqrt(uint x) private view returns (uint y) {
        uint z = (x + 1) / 2;
        y = x;

        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }

        console.log("y = ", y);
    }



    // /* ========== EVENTS ========== */
    event CreateMerchantContract(address MerchantContractAddress, address MerchantAddress, string MerchantName);
    event ApprovedMerchantContract(address MerchantContractAddress, bool Approved); // true = approved; false = not approved
    event PausedMerchantContract(address MerchantContractAddress, bool Paused); // true = paused; false = unpaused
    event VoteNewMerchantContractApproval(address Voter, address MerchantContractAddress);
    event NewMerchantContractApproved(address MerchantContractAddress);
    event SaveHistoric(address MerchantContractAddress, uint Sells, uint Refunds, uint Purchases, uint Cancellations);
}

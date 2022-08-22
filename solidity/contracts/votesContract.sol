// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import "./mainContract2.sol";

contract VotesContract is MainContract2 {
    struct Votes {
        bool voted; // false: didn't vote; true: already voted
    }

    // msg.sender => (MerchantContractAddress => Votes)
    mapping(address => mapping(address => Votes)) saveVoters;

    
    function getNumberofVotesMerchantContract(address MerchantContractAddress) public view onlyOwner returns(uint) {
        uint numberOfVotes = merchants[MerchantContractAddress].votes;

        console.log("MerchantContractAddress: ", MerchantContractAddress);
        console.log("numberOfVotes: ", numberOfVotes);
        return numberOfVotes;
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

    function sqrt(uint x) private view returns (uint y) {
        uint z = (x + 1) / 2;
        y = x;

        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }

        console.log("y = ", y);
    }



    /* ========== EVENTS ========== */
    event VoteNewMerchantContractApproval(address Voter, address MerchantContractAddress);
    event NewMerchantContractApproved(address MerchantContractAddress);
    event ApprovedMerchantContract(address MerchantContractAddress, bool Approved); // true = approved; false = not approved
}

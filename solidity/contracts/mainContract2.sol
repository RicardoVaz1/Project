// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import "./mainContract.sol";

contract MainContract2 is MainContract {
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



    /* ========== EVENTS ========== */
    event CreateMerchantContract(address MerchantContractAddress, address MerchantAddress, string MerchantName);
    event PausedMerchantContract(address MerchantContractAddress, bool Paused); // true = paused; false = unpaused
}

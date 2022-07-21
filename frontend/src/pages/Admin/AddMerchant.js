import React, { useState } from 'react'
// import { useNavigate } from "react-router-dom";
import Sidebar from '../../components/Sidebar';

import { ethers } from "ethers";

import ContractABI from "../../abis/MainContract.json"
const MainContractABI = ContractABI.abi
const ContractAddress = '0xb06454D8cC52965bce1fDaE5AdD42aD9BFe4DF17'

const AddMerchant = () => {
    // const navigate = useNavigate();

    const [walletAddress, setWalletAddress] = useState("");
    const [name, setName] = useState("");


    /* --- Owner Wallet --- */
    /* async function connectWallet() {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const accounts = await provider.send("eth_requestAccounts", []);
        const balance = await provider.getBalance(accounts[0]);

        const daiContract = new ethers.Contract(ContractAddress, MainContractABI, provider);
    }

    async function sendDaiTo(to, amountInEther) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()

        const daiContract = new ethers.Contract(ContractAddress, MainContractABI, provider);

        const tokenUnits = await daiContract.decimals();
        const tokenAmountInEther = ethers.utils.parseUnits(amountInEther, tokenUnits);

        const daiContractWithSigner = daiContract.connect(signer);
        daiContractWithSigner.transfer("0x708Ef16bF16Bb9f14CfE36075E9ae17bCd1C5B40", tokenAmountInEther);
    } */

    async function hello() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        // const account = await window.ethereum.request({
        //     method: "eth_requestAccounts",
        // });

        const signer = provider.getSigner();

        const erc20 = new ethers.Contract(
            ContractAddress,
            MainContractABI,
            signer
        );

        try {
            const user = await erc20.hello();
            console.log("Solidity: ", user);
        } catch (error) {
            console.log("ERROR AT GETTING USER: ", error);
        }
    }


    function submit() {
        if (walletAddress === "" || name === "") {
            alert("Fill all fields!")
            return;
        }

        // connectWallet()
        // sendDaiTo()

        if (!window.ethereum) return

        // const provider = new ethers.providers.Web3Provider(window.ethereum)
        // const contractInstance = new ethers.Contract(ContractAddress, MainContractABI, provider);

        // const result = contractInstance.hello()
        //     .then((result) => console.log(result))
        //     .catch('error', console.error)

        // console.log(provider)
        // console.log(contractInstance)
        // console.log(result)

        hello()

        // console.log("Done!")
        // console.log("Wallet Ãddress: ", walletAddress)
        // console.log("Name: ", name)

        document.getElementById("done-successfully").style.display = '';

        // MainContract > addMerchantContract(walletAddress, name)

        // setTimeout(function () {
        //     navigate("/admin-logged")
        // }, 3000);
    }

    return (
        <div>
            <h1>Add Merchant</h1>

            <Sidebar logged={"admin"} />

            <div id="page-wrap">
                <label htmlFor="walletAddress">Address:</label>
                <input
                    type="text"
                    id="walletAddress"
                    name="fname"
                    placeholder="Insert Merchant wallet address"
                    onChange={(e) => setWalletAddress(e.target.value)}
                />
                <br />

                <label htmlFor="merchantName">Name: </label>
                <input
                    type="text"
                    id="merchantName"
                    name="lname"
                    placeholder="Insert Merchant name"
                    onChange={(e) => setName(e.target.value)}
                />
                <br />

                <button onClick={() => submit()}>Submit</button>
                <br />

                <span id="done-successfully" style={{ "display": "none" }}>Merchant added successfully!</span>
            </div>
        </div>
    )
}

export default AddMerchant

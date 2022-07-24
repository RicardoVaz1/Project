import { useState, useEffect } from 'react'
import * as constants from '../../constants'

import Sidebar from '../../components/Sidebar'

import { ethers } from "ethers"
import MerchantContractABI from "../../abis/MerchantContract.json"
const ContractAddress = constants.CONTRACTADDRESS


const PersonalInfo = ({ currentAccount }) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const instanceMerchantContract = new ethers.Contract(ContractAddress, MerchantContractABI.abi, signer)

    const [walletAddress, setWalletAddress] = useState("")
    const [name, setName] = useState("")
    const [escrowAmount, setEscrowAmount] = useState("")
    const [balance, setBalance] = useState("")

    useEffect(() => {
        getMerchantInfo()
    })

    async function getMerchantInfo() {
        try {
            const merchantAddress = await instanceMerchantContract.hello() // checkMyAddress().call({from: currentAccount})
            const merchantName = await instanceMerchantContract.hello() // checkMyName().call({from: currentAccount})
            const merchantEscrowAmount = await instanceMerchantContract.hello() // checkMyEscrowAmount().call({from: currentAccount})
            const merchantBalance = await instanceMerchantContract.hello() // checkMyBalance().call({from: currentAccount})

            console.log("Merchant Address: ", merchantAddress)
            console.log("Merchant Name: ", merchantName)
            console.log("Merchant EscrowAmount: ", merchantEscrowAmount)
            console.log("Merchant Balance: ", merchantBalance)

            setWalletAddress(merchantAddress)
            setName(merchantName)
            setEscrowAmount(merchantEscrowAmount)
            setBalance(merchantBalance)
        } catch (error) {
            console.log("ERROR AT GETTING MERCHANT INFO: ", error)
        }
    }

    async function changeAddress() {
        if (walletAddress === "") {
            alert("Fill the wallet address!")
            return
        }

        console.log("Done!")
        console.log("Wallet Address: ", walletAddress)

        document.getElementById("done-successfully").style.display = ''

        try {
            const merchantNewAddress = await instanceMerchantContract.hello() // changeMyAddress(walletAddress).call({from: currentAccount})
            console.log("Merchant New Address: ", merchantNewAddress)

            setWalletAddress(merchantNewAddress)
        } catch (error) {
            console.log("ERROR AT GETTING MERCHANT INFO: ", error)
        }

        setTimeout(function () {
            document.getElementById("done-successfully").style.display = 'none'
        }, 2000)
    }

    /* async function changeName() {
        if (name === "") {
            alert("Fill the name!")
            return
        }

        console.log("Done!")
        console.log("Name: ", name)

        document.getElementById("done-successfully").style.display = ''

        try {
            const merchantNewName = await instanceMerchantContract.hello() // changeMyName(name).call({from: currentAccount})
            console.log("Merchant New Name: ", merchantNewName)

            setName(merchantNewName)
        } catch (error) {
            console.log("ERROR AT GETTING MERCHANT INFO: ", error)
        }

        setTimeout(function () {
            document.getElementById("done-successfully").style.display = 'none'
        }, 2000)
    } */

    return (
        <>
            <h3>My Smart Contract Info</h3>

            <Sidebar logged={"merchant"} />

            <label htmlFor="walletAddress">Address:</label>
            <input
                type="text"
                id="walletAddress"
                name="fname"
                placeholder="Insert your wallet address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
            />
            <button onClick={() => changeAddress()}>Change</button>
            <br />

            <label htmlFor="name">Name: </label>
            <span>{name}</span>
            {/* <input
                type="text"
                id="name"
                name="fname"
                placeholder="Insert your wallet address"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button onClick={() => changeName()}>Change</button> */}
            <br />

            <label htmlFor="escrowAmount">Escrow Amount: </label>
            <span>{escrowAmount >= 10 ** 18 ? escrowAmount / 10 ** 18 + " ETH" : escrowAmount + " ETH"}</span>
            <br />

            <label htmlFor="balance">Balance: </label>
            <span>{balance >= 10 ** 18 ? balance / 10 ** 18 + " ETH" : balance + " ETH"}</span>

            <span id="done-successfully" style={{ "display": "none" }}>Done successfully!</span>
        </>
    )
}

export default PersonalInfo

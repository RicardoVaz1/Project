import { useState, useEffect } from 'react'
import * as constants from '../../constants'

import { ethers } from "ethers"
import MerchantContractABI from "../../abis/MerchantContract.json"
const ContractAddress = constants.CONTRACTADDRESS

const Withdrawals = ({ currentAccount }) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const instanceMerchantContract = new ethers.Contract(ContractAddress, MerchantContractABI.abi, signer)

    const [balance, setBalance] = useState("")

    useEffect(() => {
        getMerchantInfo()
    })

    async function getMerchantInfo() {
        try {
            const merchantBalance = await instanceMerchantContract.hello() // checkMyBalance().call({from: currentAccount})

            console.log("Merchant Balance: ", merchantBalance)

            setBalance(merchantBalance)
        } catch (error) {
            console.log("ERROR AT GETTING MERCHANT INFO: ", error)
        }
    }

    async function withdrawal() {
        console.log("Done!")

        document.getElementById("done-successfully-3").style.display = ''

        try {
            const merchantWithdrawal = await instanceMerchantContract.hello() // withdrawal().call({from: currentAccount})
            console.log("Merchant Withdrawal: ", merchantWithdrawal)
        } catch (error) {
            console.log("ERROR DURING WITHDRAWAL: ", error)
        }

        setTimeout(function () {
            document.getElementById("done-successfully-3").style.display = 'none'
        }, 2000)
    }

    return (
        <>
            <h1>Withdrawals</h1>
            <label htmlFor="total">Total: </label>
            <label htmlFor="balance">{balance} ETH</label>
            <br />

            <button onClick={() => withdrawal()}>Withdrawal</button>

            <span id="done-successfully-3" style={{ "display": "none" }}>Done successfully!</span>
        </>
    )
}

export default Withdrawals

import { useState, useEffect, useCallback, useRef } from 'react'

import { ethers } from "ethers"
import MerchantContractABI from "../../abis/MerchantContract.json"


const Withdrawals = () => {
    const { currentAccount, MerchantContractAddress } = JSON.parse(localStorage.getItem("userData"))
    const [balance, setBalance] = useState(0)

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const instanceMerchantContract = useRef(new ethers.Contract(MerchantContractAddress, MerchantContractABI.abi, signer))


    const getMerchantBalance = useCallback(async () => {
        const instanceMerchantContract2 = instanceMerchantContract.current

        try {
            const merchantBalance = await instanceMerchantContract2.getBalance({ from: currentAccount })
            setBalance(parseInt(merchantBalance._hex, 16))
        } catch (error) {
            console.log("ERROR AT GETTING MERCHANT BALANCE: ", error)
        }
    }, [currentAccount])

    async function withdrawal() {
        const instanceMerchantContract2 = instanceMerchantContract.current

        try {
            const merchantWithdrawal = await instanceMerchantContract2.withdrawal({ from: currentAccount, gasLimit: 1500000 })
            console.log("Merchant Withdrawal: ", merchantWithdrawal)

            document.getElementById("done-successfully-3").style.display = ''
        } catch (error) {
            console.log("ERROR DURING WITHDRAWAL: ", error)
        }

        setTimeout(function () {
            document.getElementById("done-successfully-3").style.display = 'none'
        }, 2000)
    }


    useEffect(() => {
        getMerchantBalance()
    }, [getMerchantBalance])


    return (
        <>
            <h1>Withdrawals</h1>

            <label htmlFor="total">Total: </label>
            <label htmlFor="balance">{balance >= 10 ** 18 ? balance / 10 ** 18 + " ETH" : balance + " Wei"}</label>
            <br />

            <button onClick={() => withdrawal()}>Withdrawal</button>

            <span id="done-successfully-3" style={{ "display": "none" }}>Done successfully!</span>
        </>
    )
}

export default Withdrawals

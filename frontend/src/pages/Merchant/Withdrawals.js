import { useState, useEffect, useCallback, useRef } from 'react'

import { ethers } from "ethers"
import MerchantContractABI from "../../abis/MerchantContract.json"
// import { MERCHANTCONTRACTADDRESS } from '../../constants'

const Withdrawals = () => {
    const { currentAccount, MerchantContractAddress } = JSON.parse(localStorage.getItem("userData"))

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const instanceMerchantContract = useRef(new ethers.Contract(MerchantContractAddress, MerchantContractABI.abi, signer))

    const [balance, setBalance] = useState(0)


    const getMerchantBalance = useCallback(async () => {
        const instanceMerchantContract2 = instanceMerchantContract.current

        try {
            const merchantBalance = await instanceMerchantContract2.checkMyBalance({ from: currentAccount })
            // console.log("Merchant Balance: ", merchantBalance)

            setBalance(parseInt(merchantBalance._hex, 16))
        } catch (error) {
            console.log("ERROR AT GETTING MERCHANT BALANCE: ", error)
        }
    }, [currentAccount])

    useEffect(() => {
        getMerchantBalance()
    }, [getMerchantBalance])


    async function withdrawal() {
        try {
            const merchantWithdrawal = await instanceMerchantContract.withdrawal({ from: currentAccount, gasLimit: 1500000 })
            console.log("Merchant Withdrawal: ", merchantWithdrawal)

            document.getElementById("done-successfully-3").style.display = ''
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
            <label htmlFor="balance">{balance}</label>
            <br />

            <button onClick={() => withdrawal()}>Withdrawal</button>

            <span id="done-successfully-3" style={{ "display": "none" }}>Done successfully!</span>
        </>
    )
}

export default Withdrawals

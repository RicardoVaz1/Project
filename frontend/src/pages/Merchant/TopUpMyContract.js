import { useState } from 'react'
import * as constants from '../../constants'

import { ethers } from "ethers"
import MerchantContractABI from "../../abis/MerchantContract.json"
const ContractAddress = constants.CONTRACTADDRESS


const TopUpMyContract = ({ currentAccount }) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const instanceMerchantContract = new ethers.Contract(ContractAddress, MerchantContractABI.abi, signer)

    const [amount, setAmount] = useState(0)

    async function topUpMyContract() {
        if (amount === null) {
            alert("Fill the amount!")
            return
        }

        console.log("Done!")
        console.log("amount: ", amount)

        document.getElementById("done-successfully-5").style.display = ''

        try {
            const merchantTopUpContract = await instanceMerchantContract.hello() // topUpMyContract().call({from: currentAccount, value: amount})
            console.log("Merchant Top Up Contract: ", merchantTopUpContract)
        } catch (error) {
            console.log("ERROR DURING TOP UP CONTRACT: ", error)
        }

        setTimeout(function () {
            document.getElementById("done-successfully-5").style.display = 'none'
        }, 2000)
    }

    return (
        <>
            <h1>Top Up My Contract</h1>
            <label htmlFor="amount">Amount:</label>
            <input
                type="text"
                id="amount"
                name="fname"
                placeholder="Insert your wallet address"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <br />

            <button onClick={() => topUpMyContract()}>Top Up</button>

            <span id="done-successfully-5" style={{ "display": "none" }}>Done successfully!</span>
        </>
    )
}

export default TopUpMyContract

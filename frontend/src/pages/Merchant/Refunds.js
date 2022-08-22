import { useState } from 'react'

import { ethers } from "ethers"
import MerchantContractABI from "../../abis/MerchantContract.json"
import { MERCHANTCONTRACTADDRESS } from '../../constants'


const Refunds = () => {
    const { currentAccount, /*MerchantContractAddress*/ } = JSON.parse(localStorage.getItem("userData"))

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const instanceMerchantContract = new ethers.Contract(MERCHANTCONTRACTADDRESS, MerchantContractABI.abi, signer)

    const [idPurchase, setIDPurchase] = useState(0)
    const [buyerAddress, setBuyerAddress] = useState("")
    const [refundAmount, setRefundAmount] = useState(0)

    async function refund() {
        if (idPurchase === null || buyerAddress === "" || refundAmount === null) {
            alert("Fill the all fields!")
            return
        }

        try {
            // console.log("idPurchase: ", idPurchase)
            // console.log("buyerAddress: ", buyerAddress)
            // console.log("refundAmount: ", refundAmount)

            const merchantNewRefund = await instanceMerchantContract.refund(idPurchase, buyerAddress, refundAmount, { from: currentAccount, gasLimit: 1500000 })
            console.log("Merchant New Refund: ", merchantNewRefund)

            document.getElementById("done-successfully-4").style.display = ''
        } catch (error) {
            console.log("ERROR DURING REFUND: ", error)
        }

        setTimeout(function () {
            document.getElementById("done-successfully-4").style.display = 'none'
        }, 2000)
    }

    return (
        <>
            <h1>Refunds</h1>
            <label htmlFor="idPurchase">ID Purchase:</label>
            <input
                type="text"
                id="idPurchase"
                name="fname"
                placeholder="Insert your wallet address"
                value={idPurchase}
                onChange={(e) => setIDPurchase(e.target.value)}
            />
            <br />

            <label htmlFor="buyerAddress">Buyer Address:</label>
            <input
                type="text"
                id="buyerAddress"
                name="fname"
                placeholder="Insert your wallet address"
                value={buyerAddress}
                onChange={(e) => setBuyerAddress(e.target.value)}
            />
            <br />

            <label htmlFor="refundAmount">Refund Amount:</label>
            <input
                type="text"
                id="refundAmount"
                name="fname"
                placeholder="Insert your wallet address"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
            />
            <br />

            <button onClick={() => refund()}>Send Refund</button>

            <span id="done-successfully-4" style={{ "display": "none" }}>Done successfully!</span>
        </>
    )
}

export default Refunds

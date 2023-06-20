import { useState } from 'react'

import { ethers } from "ethers"
import MerchantContractABI from "../../abis/MerchantContract.json"


const Refunds = () => {
    const { currentAccount, MerchantContractAddress } = JSON.parse(localStorage.getItem("userData"))
    const [idPurchase, setIDPurchase] = useState(0)
    const [refundAmount, setRefundAmount] = useState(0)

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const instanceMerchantContract = new ethers.Contract(MerchantContractAddress, MerchantContractABI.abi, signer)


    async function refund() {
        if (idPurchase === null || refundAmount === null) {
            alert("Fill the all fields!")
            return
        }

        try {
            const merchantNewRefund = await instanceMerchantContract.refund(idPurchase, refundAmount, { from: currentAccount, gasLimit: 1500000 })
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
                placeholder="Insert the ID Purchase"
                value={idPurchase}
                onChange={(e) => setIDPurchase(e.target.value)}
            />
            <br />

            <label htmlFor="refundAmount">Refund Amount:</label>
            <input
                type="text"
                id="refundAmount"
                name="fname"
                placeholder="Insert the refund amount"
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

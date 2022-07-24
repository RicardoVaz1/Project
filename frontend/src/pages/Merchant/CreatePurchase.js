import { useState } from 'react'
import * as constants from '../../constants'

import { ethers } from "ethers"
import MerchantContractABI from "../../abis/MerchantContract.json"
const ContractAddress = constants.CONTRACTADDRESS


const CreatePurchase = ({ currentAccount }) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const instanceMerchantContract = new ethers.Contract(ContractAddress, MerchantContractABI.abi, signer)

    const [idPurchase, setIDPurchase] = useState(0)
    const [purchaseAmount, setPurchaseAmount] = useState(0)
    const [escrowTime, setEscrowTime] = useState(0)

    async function createPurchase() {
        if (idPurchase === null || purchaseAmount === null || escrowTime === null) {
            alert("Fill the all fields!")
            return
        }

        console.log("Done!")
        console.log("idPurchase: ", idPurchase)
        console.log("purchaseAmount: ", purchaseAmount)
        console.log("escrowTime: ", escrowTime)

        document.getElementById("done-successfully-1").style.display = ''

        try {
            const merchantNewPurchase = await instanceMerchantContract.hello() // createPurchase(idPurchase, purchaseAmount, escrowTime).call({from: currentAccount})
            console.log("Merchant New Purchase: ", merchantNewPurchase)
        } catch (error) {
            console.log("ERROR AT CREATING NEW PURCHASE: ", error)
        }

        setTimeout(function () {
            document.getElementById("done-successfully-1").style.display = 'none'
        }, 2000)
    }

    return (
        <>
            <h3>Create Purchase</h3>
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

            <label htmlFor="purchaseAmount">Purchase Amount:</label>
            <input
                type="text"
                id="purchaseAmount"
                name="fname"
                placeholder="Insert your wallet address"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
            />
            <br />

            <label htmlFor="escrowTime">Escrow Time:</label>
            <input
                type="text"
                id="escrowTime"
                name="fname"
                placeholder="Insert your wallet address"
                value={escrowTime}
                onChange={(e) => setEscrowTime(e.target.value)}
            />
            <br />

            <button onClick={() => createPurchase()}>Create</button>

            <span id="done-successfully-1" style={{ "display": "none" }}>Done successfully!</span>
        </>
    )
}

export default CreatePurchase

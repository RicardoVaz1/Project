import { useState, useEffect } from 'react'

import { ethers } from "ethers"
import MerchantContractABI from "../../abis/MerchantContract.json"
const axios = require("axios")


const CreatePurchase = () => {
    const { currentAccount, MerchantContractAddress } = JSON.parse(localStorage.getItem("userData"))
    const [purchasesList, setPurchasesList] = useState([])
    const [idPurchase, setIDPurchase] = useState(0)
    const [purchaseAmount, setPurchaseAmount] = useState(0)
    const [cancelTime, setCancelTime] = useState(0)
    const [completeTime, setCompleteTime] = useState(0)

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const instanceMerchantContract = new ethers.Contract(MerchantContractAddress, MerchantContractABI.abi, signer)


    async function getPurchasesList(contractInstance) {
        try {
            const result = await axios.post(
                `${process.env.REACT_APP_THE_GRAPH_API}`,
                {
                    query: `
                    {
                        createPurchases(orderBy: idPurchase, orderDirection: asc, where: {contractInstance: "${contractInstance}"}) {
                            id
                            contractInstance
                            idPurchase
                            purchaseAmount
                            cancelTime
                            completeTime
                        }
                    }
                    `
                }
            )

            let PurchasesList = result.data.data.createPurchases
            setPurchasesList(PurchasesList)
        } catch (error) {
            console.log(error)
        }
    }

    async function createPurchase() {
        if (idPurchase === null || purchaseAmount === null || cancelTime === null || completeTime === null) {
            alert("Fill the all fields!")
            return
        }

        for (let i = 0; i < purchasesList.length; i++) {
            if (purchasesList[i].idPurchase === idPurchase) {
                alert("This IDPurchase already exist!")
                return
            }
        }

        try {
            const merchantNewPurchase = await instanceMerchantContract.createPurchase(idPurchase, purchaseAmount, cancelTime, completeTime, { from: currentAccount, gasLimit: 1500000 })
            console.log("Merchant New Purchase: ", merchantNewPurchase)

            document.getElementById("done-successfully-1").style.display = ''
        } catch (error) {
            console.log("ERROR AT CREATING NEW PURCHASE: ", error)
        }

        setTimeout(function () {
            document.getElementById("done-successfully-1").style.display = 'none'
        }, 2000)
    }


    useEffect(() => {
        getPurchasesList(MerchantContractAddress)
    }, [MerchantContractAddress])


    return (
        <>
            <h3>Create Purchase</h3>

            <label htmlFor="idPurchase">ID Purchase:</label>
            <input
                type="text"
                id="idPurchase"
                name="fname"
                placeholder="Insert the ID purchase"
                value={idPurchase}
                onChange={(e) => setIDPurchase(e.target.value)}
            />
            <br />

            <label htmlFor="purchaseAmount">Purchase Amount:</label>
            <input
                type="text"
                id="purchaseAmount"
                name="fname"
                placeholder="Insert the purchase amount"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
            />
            <br />

            <label htmlFor="cancelTime">Cancel Time:</label>
            <input
                type="text"
                id="cancelTime"
                name="fname"
                placeholder="Insert the cancel time"
                value={cancelTime}
                onChange={(e) => setCancelTime(e.target.value)}
            />
            <br />

            <label htmlFor="completeTime">Complete Time:</label>
            <input
                type="text"
                id="completeTime"
                name="fname"
                placeholder="Insert the complete time"
                value={completeTime}
                onChange={(e) => setCompleteTime(e.target.value)}
            />
            <br />

            <button onClick={() => createPurchase()}>Create</button>

            <span id="done-successfully-1" style={{ "display": "none" }}>Done successfully!</span>
        </>
    )
}

export default CreatePurchase

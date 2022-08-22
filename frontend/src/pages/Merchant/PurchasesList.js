import { useEffect, useState } from "react"

import { ethers } from "ethers"
import MerchantContractABI from "../../abis/MerchantContract.json"
import { MERCHANTCONTRACTADDRESS } from '../../constants'
const axios = require("axios")


const PurchasesList = () => {
    const { currentAccount, MerchantContractAddress } = JSON.parse(localStorage.getItem("userData"))
    const [purchasesList, setPurchasesList] = useState([])

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const instanceMerchantContract = new ethers.Contract(MERCHANTCONTRACTADDRESS, MerchantContractABI.abi, signer)

    async function getPurchasesList(MerchantContractAddress) {
        try {
            const result = await axios.post(
                `${process.env.REACT_APP_THE_GRAPH_API}`,
                {
                    query: `
                    {
                        createPurchases(where: {MerchantAddress: "${MerchantContractAddress}"}) {
                            MerchantContractAddress
                            IDPurchase
                            DateC
                            PurchaseAmount
                            EscrowTime
                            PurchaseStatus
                        }
                    }
                    `
                }
            )

            let PurchasesList = result.data.data.createPurchases
            console.log("PurchasesList: ", PurchasesList)

            setPurchasesList(PurchasesList)
        } catch (error) {
            console.log(error)
        }
    }

    /* async function getPurchaseStatus(ID) {
        try {
            const purchaseStatus = await instanceMerchantContract.getPurchaseStatus(ID, { from: currentAccount })

            switch(purchaseStatus) {
                case 0:
                    console.log("PurchaseStatus: ", purchaseStatus)
                    return "Not created"
                case 1:
                    console.log("PurchaseStatus: ", purchaseStatus)
                    return "Not paid"
                case 2:
                    console.log("PurchaseStatus: ", purchaseStatus)
                    return "Paid"
                case 3:
                    console.log("PurchaseStatus: ", purchaseStatus)
                    return "Refunded"
                default:
                    console.log("ERROR AT GETTING PURCHASE STATUS!")
                    return "Error"
            }
        } catch (error) {
            console.log("ERROR AT GETTING PURCHASE STATUS: ", error)
        }
    } */

    async function completePurchase(ID) {
        try {
            // console.log("ID: ", ID)

            const merchantPurchaseComplete = await instanceMerchantContract.complete(ID, { from: currentAccount })
            console.log("Merchant Purchase Complete: ", merchantPurchaseComplete)

            document.getElementById("done-successfully-2").style.display = ''
        } catch (error) {
            console.log("ERROR AT COMPLETING PURCHASE: ", error)
        }

        setTimeout(function () {
            document.getElementById("done-successfully-2").style.display = 'none'
        }, 2000)
    }

    useEffect(() => {
        getPurchasesList(MerchantContractAddress)
    }, [MerchantContractAddress])

    return (
        <>
            <h1>Purchases List</h1>

            <table className="table">
                <tr>
                    <th>ID Purchase</th>
                    <th>Purchase Amount</th>
                    <th>Escrow Time</th>
                    <th>Status</th>
                    <th></th>
                </tr>

                {purchasesList.map((item) => {
                    return (
                        <tr className="item" key={item.IDPurchase}>
                            <td className="itemDisplay">{item.IDPurchase}</td>
                            <td className="itemDisplay">{item.PurchaseAmount}</td>
                            <td className="itemDisplay">{item.EscrowTime}</td>
                            <td className="itemDisplay">{item.PurchaseStatus}</td>
                            <td className="removeItemButton">
                                {item.PurchaseStatus === 2 ?
                                    <button onClick={() => completePurchase(item.IDPurchase)}>Collect</button> : ""}
                            </td>
                        </tr>
                    )
                })}
            </table>

            <span id="done-successfully-2" style={{ "display": "none" }}>Done successfully!</span>
        </>
    )
}

export default PurchasesList

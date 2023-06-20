import { useState, useEffect, useCallback, useRef } from 'react'

import { ethers } from "ethers"
import MerchantContractABI from "../../abis/MerchantContract.json"
const axios = require("axios")


const PurchasesList = () => {
    const { currentAccount, MerchantContractAddress } = JSON.parse(localStorage.getItem("userData"))
    const [purchasesList, setPurchasesList] = useState([])
    const purchasesInfo = useState([])

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const instanceMerchantContract = useRef(new ethers.Contract(MerchantContractAddress, MerchantContractABI.abi, signer))


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

    const getMerchantContractInfo = useCallback(async () => {
        const instanceMerchantContract2 = instanceMerchantContract.current

        for (let i = 0; i < purchasesList.length; i++) {
            const IDPurchase = purchasesList[i].idPurchase

            try {
                const purchase_status = await instanceMerchantContract2.purchaseStatus(IDPurchase)
                let purchase_status_int = parseInt(purchase_status, 16)

                purchasesInfo.push({ id: purchasesList[i].id, MerchantContractAddress: MerchantContractAddress, idPurchase: IDPurchase, purchaseStatus: purchase_status_int })

                for (let i = 0; i < purchasesInfo.length; i++) {
                    if (purchasesInfo[i].MerchantContractAddress) {
                        if (purchasesInfo[i].purchaseStatus === 0) {
                            document.getElementById(`${purchasesInfo[i].idPurchase}_status`).textContent = "Not Created"
                        }

                        if (purchasesInfo[i].purchaseStatus === 1) {
                            document.getElementById(`${purchasesInfo[i].idPurchase}_status`).textContent = "Not Paid"
                        }

                        if (purchasesInfo[i].purchaseStatus === 2) {
                            document.getElementById(`${purchasesInfo[i].idPurchase}_status`).textContent = "Paid"
                            document.getElementById(`${purchasesInfo[i].idPurchase}_button`).setAttribute("style", "display: table-cell;")
                        }

                        if (purchasesInfo[i].purchaseStatus === 3) {
                            document.getElementById(`${purchasesInfo[i].idPurchase}_status`).textContent = "Completed"
                        }

                        if (purchasesInfo[i].purchaseStatus === 4) {
                            document.getElementById(`${purchasesInfo[i].idPurchase}_status`).textContent = "Refunded"
                        }

                        if (purchasesInfo[i].purchaseStatus === 5) {
                            document.getElementById(`${purchasesInfo[i].idPurchase}_status`).textContent = "Canceled"
                        }
                    }
                }
            } catch (error) {
                console.log("ERROR AT GETTING MERCHANT CONTRACT INFO: ", error)
            }
        }
    }, [purchasesInfo, purchasesList, MerchantContractAddress])

    async function completePurchase(ID) {
        const instanceMerchantContract2 = instanceMerchantContract.current

        try {
            const merchantPurchaseComplete = await instanceMerchantContract2.complete(ID, { from: currentAccount, gasLimit: 1500000 })
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

    useEffect(() => {
        getMerchantContractInfo()
    }, [getMerchantContractInfo])


    return (
        <>
            <h1>Purchases List</h1>

            <table className="table">
                <thead>
                    <tr>
                        <th></th>
                        <th>ID Purchase</th>
                        <th>Purchase Amount</th>
                        <th>Cancel Time</th>
                        <th>Complete Time</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {purchasesList.map((item, i) => {
                        return (
                            <tr className="item" key={item.idPurchase}>
                                <td className="itemDisplay">{i + 1}</td>
                                <td className="itemDisplay">{item.idPurchase}</td>
                                <td className="itemDisplay">{item.purchaseAmount}</td>
                                <td className="itemDisplay">{item.cancelTime}</td>
                                <td className="itemDisplay">{item.completeTime}</td>
                                <td className="itemDisplay"><span id={`${item.idPurchase}_status`}></span></td>
                                <td className="removeItemButton" id={`${item.idPurchase}_button`} style={{ display: "none" }}>
                                    <button onClick={() => completePurchase(item.idPurchase)}>Collect</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            <span id="done-successfully-2" style={{ "display": "none" }}>Done successfully!</span>
        </>
    )
}

export default PurchasesList

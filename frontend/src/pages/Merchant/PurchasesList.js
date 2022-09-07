import { useState, useEffect, useCallback, useRef } from 'react'

import { ethers } from "ethers"
import MerchantContractABI from "../../abis/MerchantContract.json"
// import { MERCHANTCONTRACTADDRESS } from '../../constants'
const axios = require("axios")


const PurchasesList = () => {
    const { currentAccount, MerchantContractAddress } = JSON.parse(localStorage.getItem("userData"))
    const [purchasesList, setPurchasesList] = useState([])
    const purchasesInfo = useState([])


    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    // const instanceMerchantContract = new ethers.Contract(MerchantContractAddress, MerchantContractABI.abi, signer)
    const instanceMerchantContract = useRef(new ethers.Contract(MerchantContractAddress, MerchantContractABI.abi, signer))


    async function getPurchasesList(MerchantContractAddress) {
        try {
            const result = await axios.post(
                `${process.env.REACT_APP_THE_GRAPH_API}`,
                {
                    query: `
                    {
                        createPurchases(where: {MerchantContractAddress: "${MerchantContractAddress}"}) {
                            id
                            MerchantContractAddress
                            IDPurchase
                            DateCreated
                            PurchaseAmount
                            EscrowTime
                        }
                    }
                    `
                }
            )

            let PurchasesList = result.data.data.createPurchases
            // console.log("PurchasesList: ", PurchasesList)

            setPurchasesList(PurchasesList)
        } catch (error) {
            console.log(error)
        }
    }

    const getMerchantContractInfo = useCallback(async () => {
        const instanceMerchantContract2 = instanceMerchantContract.current

        for (let i = 0; i < purchasesList.length; i++) {
            // console.log(purchasesList[i])
            // console.log(purchasesList[i].PurchaseStatus)

            const IDPurchase = purchasesList[i].IDPurchase

            try {
                const purchase_status = await instanceMerchantContract2.getPurchaseStatus(IDPurchase /*, { from: currentAccount }*/)
                let purchase_status_int = parseInt(purchase_status, 16)

                purchasesInfo.push({ MerchantContractAddress: MerchantContractAddress, idPurchase: IDPurchase, purchaseStatus: purchase_status_int })

                // console.log("purchasesInfo: ", purchasesInfo)

                for (let i = 0; i < purchasesInfo.length; i++) {
                    if (purchasesInfo[i].MerchantContractAddress) {
                        // document.getElementById(`${purchasesInfo[i].MerchantContractAddress}_status`).textContent = `${purchasesInfo[i].purchaseStatus}`

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
                    }
                }
            } catch (error) {
                console.log("ERROR AT GETTING MERCHANT CONTRACT INFO: ", error)
            }

        }
    }, [purchasesInfo, purchasesList, MerchantContractAddress /*, currentAccount*/])

    async function completePurchase(ID) {
        const instanceMerchantContract2 = instanceMerchantContract.current

        try {
            // console.log("ID: ", ID)

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
                <tr>
                    <th>ID</th>
                    <th>ID Purchase</th>
                    <th>Purchase Amount</th>
                    <th>Escrow Time</th>
                    <th>Status</th>
                    <th></th>
                </tr>

                {purchasesList.map((item, i) => {
                    return (
                        <tr className="item" key={item.IDPurchase}>
                            <td className="itemDisplay">{i + 1}</td>
                            <td className="itemDisplay">{item.IDPurchase}</td>
                            <td className="itemDisplay">{item.PurchaseAmount}</td>
                            <td className="itemDisplay">{item.EscrowTime}</td>
                            <td className="itemDisplay"><span id={`${item.IDPurchase}_status`}></span></td>
                            <td className="removeItemButton" id={`${item.IDPurchase}_button`} style={{ display: "none" }}>
                                <button onClick={() => completePurchase(item.IDPurchase)}>Collect</button>
                                {/* {item.PurchaseStatus === 2 ? <button onClick={() => completePurchase(item.IDPurchase)}>Collect</button> : ""} */}
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

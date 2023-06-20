import { useState, useEffect, useCallback, useRef } from 'react'

import { ethers } from "ethers"
import MerchantContractABI from "../../abis/MerchantContract.json"
const axios = require("axios")


const ProductsList = () => {
    const [currentAccount, setCurrentAccount] = useState("")
    const [productsList, setProductsList] = useState([])
    const purchasesInfo = useState([])

    const location = new URL(window.location.href).pathname
    const locationArray = location.split("/")
    const MerchantContractAddress = locationArray[2]

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const instanceMerchantContract = useRef(new ethers.Contract(MerchantContractAddress, MerchantContractABI.abi, signer))


    async function getProductsList(contractInstance) {
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
            setProductsList(PurchasesList)
        } catch (error) {
            console.log(error)
        }
    }

    const getMerchantContractInfo = useCallback(async () => {
        const instanceMerchantContract2 = instanceMerchantContract.current

        for (let i = 0; i < productsList.length; i++) {
            const idPurchase = productsList[i].idPurchase

            try {
                const purchase_status = await instanceMerchantContract2.purchaseStatus(idPurchase)
                let purchase_status_int = purchase_status.toNumber()

                purchasesInfo.push({ id: productsList[i].id, MerchantContractAddress: MerchantContractAddress, idPurchase: idPurchase, purchaseStatus: purchase_status_int })

                for (let i = 0; i < purchasesInfo.length; i++) {
                    if (purchasesInfo[i].MerchantContractAddress) {
                        if (purchasesInfo[i].purchaseStatus === 1) { // "Not Paid"
                            document.getElementById(`${purchasesInfo[i].idPurchase}_buy`).setAttribute("style", "display: table-cell;")
                        }

                        if (purchasesInfo[i].purchaseStatus === 2) { // "Paid"
                            document.getElementById(`${purchasesInfo[i].idPurchase}_cancel`).setAttribute("style", "display: table-cell;")
                        }

                        if (purchasesInfo[i].purchaseStatus > 2) {
                            document.getElementById(`${purchasesInfo[i].idPurchase}_status`).setAttribute("style", "display: none;")
                        }
                    }
                }
            } catch (error) {
                console.log("ERROR AT GETTING MERCHANT CONTRACT INFO: ", error)
            }
        }
    }, [purchasesInfo, productsList, MerchantContractAddress])

    async function connectWallet() {
        if (!window.ethereum) {
            alert("Please install MetaMask!")
            return
        }

        provider.send("eth_requestAccounts", [])
            .then((accounts) => {
                if (accounts.length > 0) {
                    setCurrentAccount(accounts[0])
                }
            })
            .catch((e) => console.log(e))

        getMerchantContractInfo()
    }

    async function buy(idPurchase, purchaseAmount) {
        const instanceMerchantContract2 = instanceMerchantContract.current
        const _purchaseStatus = await getPurchaseStatus(idPurchase)

        try {
            if(_purchaseStatus > 1) {
                console.log("idPurchase: " + idPurchase +", purchaseStatus: ", _purchaseStatus)
                console.log("Purchase must exist and has not yet been paid! (state: 0 or 1)")
                return
            }

            const buyerNewBuy = await instanceMerchantContract2.buy(idPurchase, { from: currentAccount, value: purchaseAmount, gasLimit: 1500000 })
            console.log("Buyer New Buy: ", buyerNewBuy)

            document.getElementById("done-successfully").style.display = ''
        } catch (error) {
            console.log("ERROR AT BUYING THE PURCHASE: ", error)
        }

        setTimeout(function () {
            document.getElementById("done-successfully").style.display = 'none'
        }, 2000)
    }

    async function cancel(idPurchase) {
        const instanceMerchantContract2 = instanceMerchantContract.current
        const _purchaseStatus = await getPurchaseStatus(idPurchase)

        try {
            if(_purchaseStatus !== 2) {
                console.log("idPurchase: " + idPurchase +", purchaseStatus: ", _purchaseStatus)
                console.log("Purchase must be in payed state! (state: 2)")
                return
            }

            const buyerNewCancel = await instanceMerchantContract2.cancel(idPurchase, { from: currentAccount, gasLimit: 1500000 })
            console.log("Buyer New Cancel: ", buyerNewCancel)

            document.getElementById("done-successfully").style.display = ''
        } catch (error) {
            console.log("ERROR AT CANCELING THE PURCHASE: ", error)
        }

        setTimeout(function () {
            document.getElementById("done-successfully").style.display = 'none'
        }, 2000)
    }

    async function getPurchaseStatus(idPurchase) {
        const instanceMerchantContract2 = instanceMerchantContract.current
        let BuyerGetPurchaseStatus
    
        try {
          BuyerGetPurchaseStatus = await instanceMerchantContract2.purchaseStatus(idPurchase, { from: currentAccount, gasLimit: 1500000 })
          console.log("Buyer Get Purchase Status: ", BuyerGetPurchaseStatus.toNumber())
    
          document.getElementById("done-successfully").style.display = ''
        } catch (error) {
          console.log("ERROR AT CANCELING THE PURCHASE: ", error)
        }
    
        return BuyerGetPurchaseStatus.toNumber()
    }


    useEffect(() => {
        document.getElementById("Buyer").setAttribute("style", "font-weight: bold; color: yellow !important;")
        document.getElementById("Merchant").setAttribute("style", "font-weight: normal; color: white !important;")
        document.getElementById("Admin").setAttribute("style", "font-weight: normal; color: white !important;")
        document.getElementById("Vote").setAttribute("style", "font-weight: normal; color: white !important;")
    }, [])

    useEffect(() => {
        getProductsList(MerchantContractAddress)
    }, [MerchantContractAddress])

    useEffect(() => {
        getMerchantContractInfo()
    }, [getMerchantContractInfo])

    useEffect(() => {
        if (!currentAccount || !ethers.utils.isAddress(currentAccount)) return
        if (!window.ethereum) return
    }, [currentAccount])


    return (
        <>
            <h1>Merchant #{MerchantContractAddress.slice(0, 5)}...{MerchantContractAddress.slice(38)}: Products List</h1>

            <table className="table">
                <thead>
                    <tr>
                        <th>ID Purchase</th>
                        <th>Purchase Amount</th>
                        <th>Cancel Time</th>
                        <th>Complete Time</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {productsList.map((item, i) => {
                        return (
                            <tr className="item" key={i} id={`${item.idPurchase}_status`}>
                                <td className="itemDisplay">{item.idPurchase}</td>
                                <td className="itemDisplay">{item.purchaseAmount}</td>
                                <td className="itemDisplay">{item.cancelTime}</td>
                                <td className="itemDisplay">{item.completeTime}</td>
                                <td className="itemButton">
                                    {!currentAccount ?
                                        <button onClick={() => connectWallet()}>Connect Wallet</button> :
                                        <>
                                            <button onClick={() => buy(item.idPurchase, item.purchaseAmount)} id={`${item.idPurchase}_buy`} style={{ display: "none" }}>Buy</button>
                                            <button onClick={() => cancel(item.idPurchase)} id={`${item.idPurchase}_cancel`} style={{ display: "none" }}>Cancel</button>
                                        </>
                                    }
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            <br />

            <span id="done-successfully" style={{ "display": "none" }}>Done successfully!</span>
        </>
    )
}

export default ProductsList

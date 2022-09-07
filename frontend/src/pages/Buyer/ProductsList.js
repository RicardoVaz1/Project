import { useState, useEffect, useCallback, useRef } from 'react'
// import { useNavigate } from "react-router-dom"

import { ethers } from "ethers"
import MerchantContractABI from "../../abis/MerchantContract.json"
// import { MERCHANTCONTRACTADDRESS } from '../../constants'
const axios = require("axios")


const ProductsList = () => {
    // const navigate = useNavigate()

    const location = new URL(window.location.href).pathname
    const locationArray = location.split("/")
    const MerchantContractAddress = locationArray[2]

    const [currentAccount, setCurrentAccount] = useState("")
    const [productsList, setProductsList] = useState([])
    const purchasesInfo = useState([])

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    // const instanceMerchantContract = new ethers.Contract(MerchantContractAddress, MerchantContractABI.abi, signer)
    const instanceMerchantContract = useRef(new ethers.Contract(MerchantContractAddress, MerchantContractABI.abi, signer))

    async function getProductsList(MerchantContractAddress) {
        try {
            const result = await axios.post(
                `${process.env.REACT_APP_THE_GRAPH_API}`,
                {
                    query: `
                    {
                        createPurchases(orderBy: id, orderDirection: desc, where: {MerchantContractAddress: "${MerchantContractAddress}"}) {
                            id
                            MerchantContractAddress
                            IDPurchase
                            DateCreated
                            PurchaseAmount
                            EscrowTime
                            PurchaseStatus
                        }
                    }
                    `
                }
            )

            let PurchasesList = result.data.data.createPurchases
            // console.log("PurchasesList: ", PurchasesList)

            setProductsList(PurchasesList)
        } catch (error) {
            console.log(error)
        }
    }

    const getMerchantContractInfo = useCallback(async () => {
        const instanceMerchantContract2 = instanceMerchantContract.current

        for (let i = 0; i < productsList.length; i++) {
            // console.log(purchasesList[i])
            // console.log(purchasesList[i].PurchaseStatus)

            const IDPurchase = productsList[i].IDPurchase

            try {
                const purchase_status = await instanceMerchantContract2.getPurchaseStatus(IDPurchase)
                let purchase_status_int = parseInt(purchase_status, 16)

                purchasesInfo.push({ MerchantContractAddress: MerchantContractAddress, idPurchase: IDPurchase, purchaseStatus: purchase_status_int })

                // console.log("purchasesInfo: ", purchasesInfo)

                for (let i = 0; i < purchasesInfo.length; i++) {
                    if (purchasesInfo[i].MerchantContractAddress) {
                        if (purchasesInfo[i].purchaseStatus !== 1) {
                            // "Not Paid"
                            document.getElementById(`${purchasesInfo[i].MerchantContractAddress}_status`).setAttribute("style", "display: none;")
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
            console.log("Please install MetaMask!")
            return
        }

        // provider = new ethers.providers.Web3Provider(window.ethereum)

        provider.send("eth_requestAccounts", [])
            .then((accounts) => {
                if (accounts.length > 0) {
                    setCurrentAccount(accounts[0])
                }
            })
            .catch((e) => console.log(e))
    }

    async function buy(ID, purchaseAmount) {
        const instanceMerchantContract2 = instanceMerchantContract.current

        try {
            // console.log("ID Purchase: ", ID)
            // console.log("purchaseAmount: ", purchaseAmount)

            const buyerNewBuy = await instanceMerchantContract2.buy(ID, { from: currentAccount, value: purchaseAmount, gasLimit: 1500000 })
            console.log("Buyer New Buy: ", buyerNewBuy)

            document.getElementById("done-successfully").style.display = ''
        } catch (error) {
            console.log("ERROR AT BUYING THE PURCHASE: ", error)
        }

        setTimeout(function () {
            document.getElementById("done-successfully").style.display = 'none'
        }, 2000)
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
                <tr>
                    <th>ID</th>
                    <th>ID Purchase</th>
                    <th>Purchase Amount</th>
                    <th>Escrow Time</th>
                    <th></th>
                </tr>

                {productsList.map((item, i) => {
                    return (
                        <tr className="item" id={`${item.MerchantContractAddress}_status`}>
                            <td className="itemDisplay">{i+1}</td>
                            <td className="itemDisplay">{item.IDPurchase}</td>
                            <td className="itemDisplay">{item.PurchaseAmount}</td>
                            <td className="itemDisplay">{item.EscrowTime}</td>
                            <td className="itemButton">
                                {!currentAccount ?
                                    <button onClick={() => connectWallet()}>Connect Wallet</button> :
                                    <button onClick={() => buy(item.id, item.Amount)}>Buy</button>
                                }
                            </td>
                        </tr>
                    )
                })}
            </table>
        </>
    )
}

export default ProductsList

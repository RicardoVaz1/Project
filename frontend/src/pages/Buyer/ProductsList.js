import { useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom"

import { ethers } from "ethers"
import MerchantContractABI from "../../abis/MerchantContract.json"
import { MERCHANTCONTRACTADDRESS } from '../../constants'
const axios = require("axios")


const ProductsList = () => {
    // const navigate = useNavigate()

    const location = new URL(window.location.href).pathname
    const locationArray = location.split("/")
    const MerchantContractAddress = locationArray[2]

    const [currentAccount, setCurrentAccount] = useState("")
    const [productsList, setProductsList] = useState([])

    let provider
    let signer
    let instanceMerchantContract

    async function getProductsList(MerchantContractAddress) {
        try {
            const result = await axios.post(
                `${process.env.REACT_APP_THE_GRAPH_API}`,
                {
                    query: `
                    {
                        createPurchases(where: {MerchantAddress: "${MerchantContractAddress}"}) {
                            id
                            Date
                            Amount
                            EscrowTime
                        }
                    }
                    `
                }
            )

            let PurchasesList = result.data.data.createPurchases
            console.log("PurchasesList: ", PurchasesList)

            setProductsList(PurchasesList)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (!currentAccount || !ethers.utils.isAddress(currentAccount)) return
        if (!window.ethereum) return
    }, [currentAccount])

    useEffect(() => {
        getProductsList(MerchantContractAddress)
    }, [MerchantContractAddress])


    async function connectWallet() {
        if (!window.ethereum) {
            alert("Please install MetaMask!")
            console.log("Please install MetaMask!")
            return
        }

        provider = new ethers.providers.Web3Provider(window.ethereum)

        provider.send("eth_requestAccounts", [])
            .then((accounts) => {
                if (accounts.length > 0) {
                    setCurrentAccount(accounts[0])
                }
            })
            .catch((e) => console.log(e))
    }

    async function buy(ID, purchaseAmount) {
        provider = new ethers.providers.Web3Provider(window.ethereum)
        signer = provider.getSigner()
        instanceMerchantContract = new ethers.Contract(MERCHANTCONTRACTADDRESS, MerchantContractABI.abi, signer)

        try {
            // console.log("ID Purchase: ", ID)
            // console.log("purchaseAmount: ", purchaseAmount)

            const buyerNewBuy = await instanceMerchantContract.buy(ID, { from: currentAccount, value: purchaseAmount, gasLimit: 1500000 })
            console.log("Buyer New Buy: ", buyerNewBuy)

            document.getElementById("done-successfully").style.display = ''
        } catch (error) {
            console.log("ERROR AT BUYING THE PURCHASE: ", error)
        }

        setTimeout(function () {
            document.getElementById("done-successfully").style.display = 'none'
        }, 2000)
    }

    return (
        <>
            <h1>Merchant #{MerchantContractAddress.slice(0, 5)}...{MerchantContractAddress.slice(38)}: Products List</h1>

            <table className="table">
                <tr>
                    <th>ID Purchase</th>
                    <th>Purchase Amount</th>
                    <th>Escrow Time</th>
                    <th></th>
                </tr>

                {productsList.map((item) => {
                    return (
                        <tr className="item" key={item.IDPurchase}>
                            <td className="itemDisplay">{item.IDPurchase}</td>
                            <td className="itemDisplay">{item.PurchaseAmount} ETH</td>
                            <td className="itemDisplay">{item.EscrowTime}</td>
                            <td className="itemButton">
                                {!currentAccount ?
                                    <button onClick={() => connectWallet()}>Connect Wallet</button> :
                                    <button onClick={() => buy(item.IDPurchase, item.PurchaseAmount)}>Buy</button>
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

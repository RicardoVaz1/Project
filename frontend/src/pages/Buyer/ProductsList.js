import { useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom"

import { ethers } from "ethers"
import MerchantContractABI from "../../abis/MerchantContract.json"
import { MERCHANTCONTRACTADDRESS } from '../../constants'


const ProductsList = () => {
    // const navigate = useNavigate()

    const productsList = [
        { idPurchase: 0, purchaseAmount: 3, escrowTime: 1234 },
        { idPurchase: 1, purchaseAmount: 5, escrowTime: 1234 },
        { idPurchase: 2, purchaseAmount: 10, escrowTime: 1234 },
        { idPurchase: 3, purchaseAmount: 1, escrowTime: 1234 },
        { idPurchase: 4, purchaseAmount: 8, escrowTime: 1234 },
    ]

    const location = new URL(window.location.href).pathname
    const locationArray = location.split("/")
    const MerchantID = locationArray[3]

    const [currentAccount, setCurrentAccount] = useState("")

    let provider
    let signer
    let instanceMerchantContract

    useEffect(() => {
        if (!currentAccount || !ethers.utils.isAddress(currentAccount)) return
        if (!window.ethereum) return
    }, [currentAccount])


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
            <h1>Merchant #{MerchantID}: Products List</h1>

            <table className="table">
                <tr>
                    <th>ID Purchase</th>
                    <th>Purchase Amount</th>
                    <th>Escrow Time</th>
                    <th></th>
                </tr>

                {productsList.map((item) => {
                    return (
                        <tr className="item" key={item.idPurchase}>
                            <td className="itemDisplay">{item.idPurchase}</td>
                            <td className="itemDisplay">{item.purchaseAmount} ETH</td>
                            <td className="itemDisplay">{item.escrowTime}</td>
                            <td className="itemButton">
                                {!currentAccount ?
                                    <button onClick={() => connectWallet()}>Connect Wallet</button> :
                                    <button onClick={() => buy(item.idPurchase, item.purchaseAmount)}>Buy</button>
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

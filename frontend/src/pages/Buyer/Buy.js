import { ethers } from "ethers"
import { useEffect, useState } from "react"

import MerchantContractABI from "../../abis/MerchantContract.json"
import { MERCHANTCONTRACTADDRESS } from '../../constants'


const Buy = () => {
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
            <h1>Buy</h1>

            <label htmlFor="productName">T-shirt: </label>
            <label htmlFor="escrowTime">20 €</label>
            <br />

            {!currentAccount ?
                <button onClick={() => connectWallet()}>Connect Wallet</button> :
                <button onClick={() => buy(1, 20)}>Buy</button>
            }

            <span id="done-successfully" style={{ "display": "none" }}>Done successfully!</span>
        </>
    )
}

export default Buy

import * as constants from '../../constants'

import { ethers } from "ethers"
import MerchantContractABI from "../../abis/MerchantContract.json"
const ContractAddress = constants.CONTRACTADDRESS


const Buy = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const instanceMerchantContract = new ethers.Contract(ContractAddress, MerchantContractABI.abi, signer)

    async function buy(ID, purchaseAmount) {
        console.log("Done!")
        console.log("ID Purchase: ", ID)
        console.log("purchaseAmount: ", purchaseAmount)

        document.getElementById("done-successfully").style.display = ''

        try {
            const buyerNewBuy = await instanceMerchantContract.hello() // buy(ID).call({from: currentAccount, value: purchaseAmount})
            console.log("Buyer New Buy: ", buyerNewBuy)
        } catch (error) {
            console.log("ERROR DURING BUYING THE PURCHASE: ", error)
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

            <button onClick={() => buy(1, 20)}>Buy</button>

            <span id="done-successfully" style={{ "display": "none" }}>Done successfully!</span>
        </>
    )
}

export default Buy

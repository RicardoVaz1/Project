import { ethers } from "ethers"
import MerchantContractABI from "../../abis/MerchantContract.json"
import { MERCHANTCONTRACTADDRESS } from '../../constants'


const PurchasesList = ({ currentAccount }) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const instanceMerchantContract = new ethers.Contract(MERCHANTCONTRACTADDRESS, MerchantContractABI.abi, signer)

    const purchasesList = [
        { id: 0, purchaseAmount: 123, escrowAmount: 4567897, status: false },
        { id: 1, purchaseAmount: 741, escrowAmount: 4567897, status: false },
        { id: 2, purchaseAmount: 44, escrowAmount: 4567897, status: false },
        { id: 3, purchaseAmount: 11, escrowAmount: 4567897, status: true },
        { id: 4, purchaseAmount: 746, escrowAmount: 4567897, status: true },
    ]

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

    return (
        <>
            <h1>Purchases List</h1>

            <table className="table">
                <tr>
                    <th>ID</th>
                    <th>Purchase Amount</th>
                    <th>Escrow Time</th>
                    <th>Status</th>
                    <th></th>
                </tr>

                {purchasesList.map((item) => {
                    return (
                        <tr className="item" key={item.id}>
                            <td className="itemDisplay">{item.id}</td>
                            <td className="itemDisplay">{item.purchaseAmount}</td>
                            <td className="itemDisplay">{item.escrowAmount}</td>
                            <td className="itemDisplay">{item.status === false ? "Not Completed" : "Completed"}</td>
                            <td className="removeItemButton">
                                {item.status === false ? "" :
                                    <button onClick={() => completePurchase(item.id)}>Collect</button>}
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

import { useNavigate } from "react-router-dom"
import * as constants from '../../constants'

import { ethers } from "ethers"
import MainContractABI from "../../abis/MainContract.json"
const ContractAddress = constants.CONTRACTADDRESS

const EditMerchant = () => {
    const navigate = useNavigate()

    const location = new URL(window.location.href).pathname
    const locationArray = location.split("/")
    const MerchantID = locationArray[4]

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const instanceMainContract = new ethers.Contract(ContractAddress, MainContractABI.abi, signer)

    const merchantsList = [
        { id: 0, merchantAddress: "1234", merchantName: "zxc", numberOfVotes: 50, approved: false, pausedWithdrawls: true },
        { id: 1, merchantAddress: "1234", merchantName: "zxc", numberOfVotes: 50, approved: false, pausedWithdrawls: true },
        { id: 2, merchantAddress: "1234", merchantName: "zxc", numberOfVotes: 500, approved: false, pausedWithdrawls: true },
        { id: 3, merchantAddress: "1234", merchantName: "zxc", numberOfVotes: 200, approved: false, pausedWithdrawls: true },
        { id: 4, merchantAddress: "1234", merchantName: "zxc", numberOfVotes: 1500, approved: true, pausedWithdrawls: false },
        { id: 5, merchantAddress: "1234", merchantName: "zxc", numberOfVotes: 1500, approved: true, pausedWithdrawls: false },
    ]

    async function disapprove(ID) {
        console.log("ID: ", ID)

        document.getElementById("done-successfully-1").style.display = ''

        try {
            const ownerDisapproveMerchant = await instanceMainContract.hello() // disapproveMerchantContract(ID).call({from: currentAccount})
            console.log("Owner Disapprove Merchant: ", ownerDisapproveMerchant)
        } catch (error) {
            console.log("ERROR AT DISAPPROVING MERCHANT: ", error)
        }

        setTimeout(function () {
            document.getElementById("done-successfully-1").style.display = 'none'
            // navigate("/admin-logged")
        }, 2000)
    }

    async function pauseWithdrawls(ID) {
        console.log("ID: ", ID)

        document.getElementById("done-successfully-2").style.display = ''

        try {
            const ownerPauseWithdrawls = await instanceMainContract.hello() // freezeWithdrawalsMerchantContract(ID).call({from: currentAccount})
            console.log("Owner Pause Withdrawls: ", ownerPauseWithdrawls)
        } catch (error) {
            console.log("ERROR AT PAUSING WITHDRAWLS: ", error)
        }

        setTimeout(function () {
            document.getElementById("done-successfully-2").style.display = 'none'
            // navigate("/admin-logged")
        }, 2000)
    }

    async function unpauseWithdrawls(ID) {
        console.log("ID: ", ID)

        document.getElementById("done-successfully-3").style.display = ''

        try {
            const ownerUnpauseWithdrawls = await instanceMainContract.hello() // unfreezeWithdrawalsMerchantContract(ID).call({from: currentAccount})
            console.log("Owner Unpause Withdrawls: ", ownerUnpauseWithdrawls)
        } catch (error) {
            console.log("ERROR AT UNPAUSING WITHDRAWLS: ", error)
        }

        setTimeout(function () {
            document.getElementById("done-successfully-3").style.display = 'none'
            // navigate("/admin-logged")
        }, 2000)
    }

    return (
        <>
            <h1>Edit Merchant #{MerchantID}</h1>
            <div className="side-by-side-buttons">
                <button onClick={() => navigate("/admin-logged")}>Cancel</button>

                { // IF Merchant approved -> disapprove()
                    (merchantsList[MerchantID].approved === true) ? <button onClick={() => disapprove(MerchantID)}>Disapprove</button> : ""
                }

                { // IF Merchant approved and unpausedWithdrawls -> pauseWithdrawls() 
                    (merchantsList[MerchantID].approved === true) && (merchantsList[MerchantID].pausedWithdrawls === false) ? <button onClick={() => pauseWithdrawls(MerchantID)}>PauseWithdrawls</button> :

                        // ElseIF Merchant approved and pausedWithdrawls -> unpauseWithdrawls()
                        (merchantsList[MerchantID].approved === true) && (merchantsList[MerchantID].pausedWithdrawls === true) ? <button onClick={() => unpauseWithdrawls(MerchantID)}>UnpauseWithdrawls</button> : ""
                }
            </div>

            <span id="done-successfully-1" style={{ "display": "none" }}>Merchant Disapproved! <br /> Redirecting ...</span>
            <span id="done-successfully-2" style={{ "display": "none" }}>Merchant Withdrawls Paused! <br /> Redirecting ...</span>
            <span id="done-successfully-3" style={{ "display": "none" }}>Merchant Withdrawls Unpaused! <br /> Redirecting ...</span>
        </>
    )
}

export default EditMerchant

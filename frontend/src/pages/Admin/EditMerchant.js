import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"

import { ethers } from "ethers"
import MainContractABI from "../../abis/MainContract.json"
import { MAINCONTRACTADDRESS } from '../../constants'
const axios = require("axios")


const EditMerchant = () => {
    const navigate = useNavigate()
    const { currentAccount, chainName } = JSON.parse(localStorage.getItem("userData"))
    const { numberOfVotes, statusContract, statusWithdrawals } = JSON.parse(localStorage.getItem("MerchantContractData"))
    const [merchantContractInfo, setMerchantContractInfo] = useState("")

    const location = new URL(window.location.href).pathname
    const locationArray = location.split("/")
    const MerchantContractAddress = locationArray[4]

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const instanceMainContract = new ethers.Contract(MAINCONTRACTADDRESS, MainContractABI.abi, signer)


    async function getMerchantContractInfo(MerchantContractAddress) {
        try {
            const result = await axios.post(
                `${process.env.REACT_APP_THE_GRAPH_API}`,
                {
                    query: `
                    {
                        createdMerchantContracts(where: {MerchantContractAddress: "${MerchantContractAddress}"}) {
                            id
                            MerchantContractAddress
                            MerchantAddress
                            MerchantName
                        }
                    }
                    `
                }
            )

            let MerchantsList = result.data.data.createdMerchantContracts[0]
            setMerchantContractInfo(MerchantsList)
        } catch (error) {
            console.log(error)
        }
    }

    async function disapprove(ID) {
        try {
            const ownerDisapproveMerchant = await instanceMainContract.disapproveMerchantContract(ID, { from: currentAccount, gasLimit: 1500000 })
            console.log("Owner Disapprove Merchant: ", ownerDisapproveMerchant)

            document.getElementById("done-successfully-1").style.display = ''
        } catch (error) {
            console.log("ERROR AT DISAPPROVING MERCHANT: ", error)
        }

        setTimeout(function () {
            document.getElementById("done-successfully-1").style.display = 'none'
            navigate("/admin")
        }, 2000)
    }

    async function pauseWithdrawals(ID) {
        try {
            const ownerPauseWithdrawals = await instanceMainContract.freezeWithdrawalsMerchantContract(ID, { from: currentAccount, gasLimit: 1500000 })
            console.log("Owner Pause Withdrawals: ", ownerPauseWithdrawals)

            document.getElementById("done-successfully-2").style.display = ''
        } catch (error) {
            console.log("ERROR AT PAUSING WITHDRAWALS: ", error)
        }

        setTimeout(function () {
            document.getElementById("done-successfully-2").style.display = 'none'
            navigate("/admin")
        }, 2000)
    }

    async function unpauseWithdrawals(ID) {
        try {
            const ownerUnpauseWithdrawals = await instanceMainContract.unfreezeWithdrawalsMerchantContract(ID, { from: currentAccount, gasLimit: 1500000 })
            console.log("Owner Unpause Withdrawals: ", ownerUnpauseWithdrawals)

            document.getElementById("done-successfully-3").style.display = ''
        } catch (error) {
            console.log("ERROR AT UNPAUSING WITHDRAWALS: ", error)
        }

        setTimeout(function () {
            document.getElementById("done-successfully-3").style.display = 'none'
            navigate("/admin")
        }, 2000)
    }


    useEffect(() => {
        document.getElementById("Buyer").setAttribute("style", "font-weight: normal; color: white !important;")
        document.getElementById("Merchant").setAttribute("style", "font-weight: normal; color: white !important;")
        document.getElementById("Admin").setAttribute("style", "font-weight: bold; color: yellow !important;")
        document.getElementById("Vote").setAttribute("style", "font-weight: normal; color: white !important;")
    }, [])

    useEffect(() => {
        getMerchantContractInfo(MerchantContractAddress)
    }, [MerchantContractAddress])


    return (
        <>
            <h1>Edit Merchant #{MerchantContractAddress.slice(0, 5)}...{MerchantContractAddress.slice(38)}</h1>

            <span>Merchant Contract Address: <a href={`https://${chainName}.etherscan.io/address/${MerchantContractAddress}`} target="_blank" rel="noreferrer" >{merchantContractInfo.MerchantContractAddress}</a></span>
            <br />

            <span>Merchant Name: {merchantContractInfo.MerchantName}</span>
            <br />

            <span>No. of Votes: {numberOfVotes}</span>
            <br />

            <span>Approved: {statusContract}</span>
            <br />

            <span>Withdrawals: {statusWithdrawals}</span>
            <br />
            <br />

            <div className="side-by-side-buttons">
                <button onClick={() => navigate("/admin")}>Cancel</button>

                { // IF Merchant approved -> disapprove()
                    (statusContract === "Approved") ? <button onClick={() => disapprove(MerchantContractAddress)}>Disapprove</button> : ""
                }

                { // IF Merchant approved and unpausedWithdrawals -> pauseWithdrawals() 
                    (statusContract === "Approved") && (statusWithdrawals === "Unpaused") ? <button onClick={() => pauseWithdrawals(MerchantContractAddress)}>PauseWithdrawals</button> :

                        // ElseIF Merchant approved and pausedWithdrawals -> unpauseWithdrawals()
                        (statusContract === "Approved") && (statusWithdrawals === "Paused") ? <button onClick={() => unpauseWithdrawals(MerchantContractAddress)}>UnpauseWithdrawals</button> : ""
                }
            </div>

            <span id="done-successfully-1" style={{ "display": "none" }}>Merchant Disapproved! <br /> Redirecting ...</span>
            <span id="done-successfully-2" style={{ "display": "none" }}>Merchant Withdrawals Paused! <br /> Redirecting ...</span>
            <span id="done-successfully-3" style={{ "display": "none" }}>Merchant Withdrawals Unpaused! <br /> Redirecting ...</span>
        </>
    )
}

export default EditMerchant

import { useState, useEffect } from 'react'
// import { useCallback, useRef } from 'react'
import { useNavigate } from "react-router-dom"

import { ethers } from "ethers"
import MainContractABI from "../../abis/MainContract.json"
import { MAINCONTRACTADDRESS } from '../../constants'
const axios = require("axios")

const EditMerchant = () => {
    const navigate = useNavigate()

    const location = new URL(window.location.href).pathname
    const locationArray = location.split("/")
    const MerchantContractAddress = locationArray[4]

    const { currentAccount } = JSON.parse(localStorage.getItem("userData"))
    const { numberOfVotes, statusContract, statusWithdrawals } = JSON.parse(localStorage.getItem("MerchantContractData"))


    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const instanceMainContract = new ethers.Contract(MAINCONTRACTADDRESS, MainContractABI.abi, signer)
    // const instanceMainContract = useRef(new ethers.Contract(MAINCONTRACTADDRESS, MainContractABI.abi, signer))

    const [merchantContractInfo, setMerchantContractInfo] = useState("")

    /* const merchantsList = [
        { id: 0, MerchantContractAddress: "1234", MerchantName: "zxc", numberOfVotes: 50, approved: false, pausedWithdrawls: true },
        { id: 1, MerchantContractAddress: "1234", MerchantName: "zxc", numberOfVotes: 50, approved: false, pausedWithdrawls: true },
        { id: 2, MerchantContractAddress: "1234", MerchantName: "zxc", numberOfVotes: 500, approved: false, pausedWithdrawls: true },
        { id: 3, MerchantContractAddress: "1234", MerchantName: "zxc", numberOfVotes: 200, approved: false, pausedWithdrawls: true },
        { id: 4, MerchantContractAddress: "1234", MerchantName: "zxc", numberOfVotes: 1500, approved: true, pausedWithdrawls: false },
        { id: 5, MerchantContractAddress: "1234", MerchantName: "zxc", numberOfVotes: 1500, approved: true, pausedWithdrawls: false },
    ] */

    async function disapprove(ID) {
        try {
            // console.log("ID: ", ID)

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

    async function pauseWithdrawls(ID) {
        try {
            // console.log("ID: ", ID)

            const ownerPauseWithdrawls = await instanceMainContract.freezeWithdrawalsMerchantContract(ID, { from: currentAccount, gasLimit: 1500000 })
            console.log("Owner Pause Withdrawls: ", ownerPauseWithdrawls)

            document.getElementById("done-successfully-2").style.display = ''
        } catch (error) {
            console.log("ERROR AT PAUSING WITHDRAWLS: ", error)
        }

        setTimeout(function () {
            document.getElementById("done-successfully-2").style.display = 'none'
            navigate("/admin")
        }, 2000)
    }

    async function unpauseWithdrawls(ID) {
        try {
            // console.log("ID: ", ID)

            const ownerUnpauseWithdrawls = await instanceMainContract.unfreezeWithdrawalsMerchantContract(ID, { from: currentAccount, gasLimit: 1500000 })
            console.log("Owner Unpause Withdrawls: ", ownerUnpauseWithdrawls)

            document.getElementById("done-successfully-3").style.display = ''
        } catch (error) {
            console.log("ERROR AT UNPAUSING WITHDRAWLS: ", error)
        }

        setTimeout(function () {
            document.getElementById("done-successfully-3").style.display = 'none'
            navigate("/admin")
        }, 2000)
    }


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
            // console.log("MerchantsList: ", MerchantsList)

            setMerchantContractInfo(MerchantsList)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getMerchantContractInfo(MerchantContractAddress)
    }, [MerchantContractAddress])

    useEffect(() => {
        document.getElementById("Buyer").setAttribute("style", "font-weight: normal; color: white !important;")
        document.getElementById("Merchant").setAttribute("style", "font-weight: normal; color: white !important;")
        document.getElementById("Admin").setAttribute("style", "font-weight: bold; color: yellow !important;")
        document.getElementById("Vote").setAttribute("style", "font-weight: normal; color: white !important;")
    }, [])

    /* const getMerchantContractInfo = useCallback(async () => {
        const instanceMainContract2 = instanceMainContract.current

        try {
            const merchantContractInfo = await instanceMainContract2.merchants(MerchantContractAddress)

            console.log("Merchant Address: ", merchantContractInfo)

            setMerchantContractInfo(merchantContractInfo)
        } catch (error) {
            console.log("ERROR AT GETTING MERCHANT INFO: ", error)
        }
    }, [MerchantContractAddress])

    useEffect(() => {
        getMerchantContractInfo()
    }, [getMerchantContractInfo]) */

    return (
        <>
            <h1>Edit Merchant #{MerchantContractAddress.slice(0, 5)}...{MerchantContractAddress.slice(38)}</h1>

            <span>Merchant Contract Address: <a href={`https://rinkeby.etherscan.io/address/${MerchantContractAddress}`} target="_blank" rel="noreferrer" >{merchantContractInfo.MerchantContractAddress}</a></span>
            <br />

            <span>Merchant Name: {merchantContractInfo.MerchantName}</span>
            <br />

            <span>No. of Votes: {numberOfVotes}</span>
            <br />

            <span>Approved: {statusContract}</span>
            <br />

            <span>Withdrawls: {statusWithdrawals}</span>
            <br />
            <br />

            <div className="side-by-side-buttons">
                <button onClick={() => navigate("/admin")}>Cancel</button>

                { // IF Merchant approved -> disapprove()
                    (statusContract === "Approved") ? <button onClick={() => disapprove(MerchantContractAddress)}>Disapprove</button> : ""
                }

                { // IF Merchant approved and unpausedWithdrawls -> pauseWithdrawls() 
                    (statusContract === "Approved") && (statusWithdrawals === "Unpaused") ? <button onClick={() => pauseWithdrawls(MerchantContractAddress)}>PauseWithdrawls</button> :

                        // ElseIF Merchant approved and pausedWithdrawls -> unpauseWithdrawls()
                        (statusContract === "Approved") && (statusWithdrawals === "Paused") ? <button onClick={() => unpauseWithdrawls(MerchantContractAddress)}>UnpauseWithdrawls</button> : ""
                }
            </div>

            <span id="done-successfully-1" style={{ "display": "none" }}>Merchant Disapproved! <br /> Redirecting ...</span>
            <span id="done-successfully-2" style={{ "display": "none" }}>Merchant Withdrawls Paused! <br /> Redirecting ...</span>
            <span id="done-successfully-3" style={{ "display": "none" }}>Merchant Withdrawls Unpaused! <br /> Redirecting ...</span>
        </>
    )
}

export default EditMerchant

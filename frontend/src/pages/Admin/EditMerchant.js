import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"

import { ethers } from "ethers"
import MainContractABI from "../../abis/MainContract.json"
import { MAINCONTRACTADDRESS } from '../../constants'
const axios = require("axios")


const EditMerchant = () => {
    const navigate = useNavigate()
    const { currentAccount, chainName } = JSON.parse(localStorage.getItem("userData"))
    const { numberOfVotes, statusContract } = JSON.parse(localStorage.getItem("MerchantContractData"))
    const [merchantContractInfo, setMerchantContractInfo] = useState("")

    const location = new URL(window.location.href).pathname
    const locationArray = location.split("/")
    const MerchantContractAddress = locationArray[4]

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const instanceMainContract = new ethers.Contract(MAINCONTRACTADDRESS, MainContractABI.abi, signer)


    async function getMerchantContractInfo(contractInstance) {
        try {
            const result = await axios.post(
                `${process.env.REACT_APP_THE_GRAPH_API}`,
                {
                    query: `
                    {
                        createMerchantContracts(where: {contractInstance: "${contractInstance}"}) {
                            id
                            contractInstance
                            merchantAddress
                            merchantName
                        }
                    }
                    `
                }
            )

            let MerchantsList = result.data.data.createMerchantContracts[0]
            setMerchantContractInfo(MerchantsList)
        } catch (error) {
            console.log(error)
        }
    }

    async function pause(ID) {
        try {
            const ownerPause = await instanceMainContract.pause(ID, { from: currentAccount, gasLimit: 1500000 })
            console.log("Owner Pause: ", ownerPause)

            document.getElementById("done-successfully-2").style.display = ''
        } catch (error) {
            console.log("ERROR AT PAUSING: ", error)
        }

        setTimeout(function () {
            document.getElementById("done-successfully-2").style.display = 'none'
            navigate("/admin")
        }, 2000)
    }

    async function unpause(ID) {
        try {
            const ownerUnpause = await instanceMainContract.unpause(ID, { from: currentAccount, gasLimit: 1500000 })
            console.log("Owner Unpause: ", ownerUnpause)

            document.getElementById("done-successfully-3").style.display = ''
        } catch (error) {
            console.log("ERROR AT UNPAUSING: ", error)
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

            <span>Merchant Contract Address: <a href={`https://${chainName}.etherscan.io/address/${MerchantContractAddress}`} target="_blank" rel="noreferrer" >{merchantContractInfo.contractInstance}</a></span>
            <br />

            <span>Merchant Name: {merchantContractInfo.merchantName}</span>
            <br />

            <span>No. of Votes: {numberOfVotes}</span>
            <br />

            <span>Status: {statusContract}</span>
            <br />
            <br />

            <div className="side-by-side-buttons">
                <button onClick={() => navigate("/admin")}>Cancel</button>

                { // IF Merchant approved/unpaused -> pause() ELSE -> unpaused()
                    (statusContract === "Approved/Unpaused") ? <button onClick={() => pause(MerchantContractAddress)}>Pause</button> : <button onClick={() => unpause(MerchantContractAddress)}>Unpause</button> 
                }
            </div>

            <span id="done-successfully-2" style={{ "display": "none" }}>Merchant Paused! <br /> Redirecting ...</span>
            <span id="done-successfully-3" style={{ "display": "none" }}>Merchant Unpaused! <br /> Redirecting ...</span>
        </>
    )
}

export default EditMerchant

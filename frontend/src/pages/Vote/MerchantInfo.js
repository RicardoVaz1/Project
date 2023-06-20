import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { ethers } from "ethers"
import MainContractABI from "../../abis/MainContract.json"
import { MAINCONTRACTADDRESS } from '../../constants'
const axios = require("axios")


const MerchantInfo = () => {
    const navigate = useNavigate()
    const { chainName } = JSON.parse(localStorage.getItem("userData"))
    const { numberOfVotes } = JSON.parse(localStorage.getItem("MerchantContractData"))
    const [currentAccount, setCurrentAccount] = useState("")
    const [merchantContractInfo, setMerchantContractInfo] = useState("")

    const location = new URL(window.location.href).pathname
    const locationArray = location.split("/")
    const MerchantContractAddress = locationArray[3]

    let provider
    let signer
    let instanceMainContract


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

    async function connectWallet() {
        if (!window.ethereum) {
            alert("Please install MetaMask!")
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

    async function vote(ID) {
        provider = new ethers.providers.Web3Provider(window.ethereum)
        signer = provider.getSigner()
        instanceMainContract = new ethers.Contract(MAINCONTRACTADDRESS, MainContractABI.abi, signer)

        try {
            const userVote = await instanceMainContract.voteApproval(ID, { from: currentAccount, gasLimit: 1500000 })
            console.log("User Vote: ", userVote)

            document.getElementById("done-successfully").style.display = ''
        } catch (error) {
            console.log("ERROR DURING VOTE: ", error)
        }

        setTimeout(function () {
            document.getElementById("done-successfully").style.display = 'none'
            navigate("/vote")
        }, 2000)
    }


    useEffect(() => {
        document.getElementById("Buyer").setAttribute("style", "font-weight: normal; color: white !important;")
        document.getElementById("Merchant").setAttribute("style", "font-weight: normal; color: white !important;")
        document.getElementById("Admin").setAttribute("style", "font-weight: normal; color: white !important;")
        document.getElementById("Vote").setAttribute("style", "font-weight: bold; color: yellow !important;")
    }, [])

    useEffect(() => {
        getMerchantContractInfo(MerchantContractAddress)
    }, [MerchantContractAddress])

    useEffect(() => {
        if (!currentAccount || !ethers.utils.isAddress(currentAccount)) return
        if (!window.ethereum) return
    }, [currentAccount])


    return (
        <>
            <h1>Merchant #{MerchantContractAddress.slice(0, 5)}...{MerchantContractAddress.slice(38)}</h1>

            <span>Merchant Contract Address: <a href={`https://${chainName}.etherscan.io/address/${merchantContractInfo.contractInstance}`} target="_blank" rel="noreferrer" >{merchantContractInfo.contractInstance}</a></span>
            <br />

            <span>Merchant Name: {merchantContractInfo.merchantName}</span>
            <br />

            <span>Number of Votes: {numberOfVotes}</span>
            <br />
            <br />

            <div className="side-by-side-buttons">
                <button onClick={() => navigate("/vote")}>Cancel</button>
                {!currentAccount ?
                    <button onClick={() => connectWallet()}>Connect Wallet</button> :
                    <button onClick={() => vote(MerchantContractAddress)}>Vote</button>
                }
            </div>

            <span id="done-successfully" style={{ "display": "none" }}>Thank you for your vote! <br /> Redirecting ...</span>
        </>
    )
}

export default MerchantInfo

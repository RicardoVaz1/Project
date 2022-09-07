import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { ethers } from "ethers"
import MainContractABI from "../../abis/MainContract.json"
import { MAINCONTRACTADDRESS } from '../../constants'
const axios = require("axios")

const MerchantInfo = () => {
    const navigate = useNavigate()
    const { numberOfVotes } = JSON.parse(localStorage.getItem("MerchantContractData"))

    const location = new URL(window.location.href).pathname
    const locationArray = location.split("/")
    const MerchantContractAddress = locationArray[3]

    const [currentAccount, setCurrentAccount] = useState("")

    let provider
    let signer
    let instanceMainContract

    const [merchantContractInfo, setMerchantContractInfo] = useState("")


    // const merchantsList = [
    //     { id: 0, merchantAddress: "1234", merchantName: "zxc", numberOfVotes: 50 },
    //     { id: 1, merchantAddress: "1234", merchantName: "zxc", numberOfVotes: 50 },
    //     { id: 2, merchantAddress: "1234", merchantName: "zxc", numberOfVotes: 500 },
    //     { id: 3, merchantAddress: "1234", merchantName: "zxc", numberOfVotes: 200 },
    //     { id: 4, merchantAddress: "1234", merchantName: "zxc", numberOfVotes: 1500 },
    // ]

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

    async function vote(ID) {
        provider = new ethers.providers.Web3Provider(window.ethereum)
        signer = provider.getSigner()
        instanceMainContract = new ethers.Contract(MAINCONTRACTADDRESS, MainContractABI.abi, signer)

        try {
            // console.log("ID: ", ID)

            const userVote = await instanceMainContract.voteNewMerchantContractApproval(ID, { from: currentAccount, gasLimit: 1500000 })
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
        document.getElementById("Admin").setAttribute("style", "font-weight: normal; color: white !important;")
        document.getElementById("Vote").setAttribute("style", "font-weight: bold; color: yellow !important;")
    }, [])

    return (
        <>
            <h1>Merchant #{MerchantContractAddress.slice(0, 5)}...{MerchantContractAddress.slice(38)}</h1>

            <span>Merchant Contract Address: <a href={`https://rinkeby.etherscan.io/address/${merchantContractInfo.MerchantContractAddress}`} target="_blank" rel="noreferrer" >{merchantContractInfo.MerchantContractAddress}</a></span>
            <br />

            <span>Merchant Name: {merchantContractInfo.MerchantName}</span>
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

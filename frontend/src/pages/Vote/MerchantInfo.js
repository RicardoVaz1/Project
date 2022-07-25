import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { ethers } from "ethers"
import MainContractABI from "../../abis/MainContract.json"
import { MAINCONTRACTADDRESS } from '../../constants'

const MerchantInfo = () => {
    const navigate = useNavigate()

    const location = new URL(window.location.href).pathname
    const locationArray = location.split("/")
    const MerchantID = locationArray[3]

    const [currentAccount, setCurrentAccount] = useState("")

    let provider
    let signer
    let instanceMainContract

    const merchantsList = [
        { id: 0, merchantAddress: "1234", merchantName: "zxc", numberOfVotes: 50 },
        { id: 1, merchantAddress: "1234", merchantName: "zxc", numberOfVotes: 50 },
        { id: 2, merchantAddress: "1234", merchantName: "zxc", numberOfVotes: 500 },
        { id: 3, merchantAddress: "1234", merchantName: "zxc", numberOfVotes: 200 },
        { id: 4, merchantAddress: "1234", merchantName: "zxc", numberOfVotes: 1500 },
    ]

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

            const userVote = await instanceMainContract.voteNewMerchantContractApproval(ID, { from: currentAccount })
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

    return (
        <>
            <h1>Merchant #{MerchantID}</h1>

            <span>ID: {merchantsList[MerchantID].id}</span>
            <br />

            <span>Merchant Address: {merchantsList[MerchantID].merchantAddress}</span>
            <br />

            <span>Merchant Name: {merchantsList[MerchantID].merchantName}</span>
            <br />

            <span>Number of Votes: {merchantsList[MerchantID].numberOfVotes}</span>
            <br />


            <div className="side-by-side-buttons">
                <button onClick={() => navigate("/vote")}>Cancel</button>
                {!currentAccount ?
                    <button onClick={() => connectWallet()}>Connect Wallet</button> :
                    <button onClick={() => vote(MerchantID)}>Vote</button>
                }
            </div>

            <span id="done-successfully" style={{ "display": "none" }}>Thank you for your vote! <br /> Redirecting ...</span>
        </>
    )
}

export default MerchantInfo

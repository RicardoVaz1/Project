import { useNavigate } from "react-router-dom"
import * as constants from '../../constants'

import { ethers } from "ethers"
import MainContractABI from "../../abis/MainContract.json"
const ContractAddress = constants.CONTRACTADDRESS

const MerchantInfo = () => {
    const navigate = useNavigate()

    const location = new URL(window.location.href).pathname
    const locationArray = location.split("/")
    const MerchantID = locationArray[3]

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const instanceMainContract = new ethers.Contract(ContractAddress, MainContractABI.abi, signer)

    const merchantsList = [
        { id: 0, merchantAddress: "1234", merchantName: "zxc", numberOfVotes: 50 },
        { id: 1, merchantAddress: "1234", merchantName: "zxc", numberOfVotes: 50 },
        { id: 2, merchantAddress: "1234", merchantName: "zxc", numberOfVotes: 500 },
        { id: 3, merchantAddress: "1234", merchantName: "zxc", numberOfVotes: 200 },
        { id: 4, merchantAddress: "1234", merchantName: "zxc", numberOfVotes: 1500 },
    ]

    async function vote(ID) {
        console.log("ID: ", ID)

        document.getElementById("done-successfully").style.display = ''

        try {
            const userVote = await instanceMainContract.hello() // voteNewMerchantContractApproval(ID).call({from: currentAccount})
            console.log("User Vote: ", userVote)
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
                <button onClick={() => vote(MerchantID)}>Vote</button>
            </div>

            <span id="done-successfully" style={{ "display": "none" }}>Thank you for your vote! <br /> Redirecting ...</span>
        </>
    )
}

export default MerchantInfo

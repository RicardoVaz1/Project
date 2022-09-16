import { useState, useEffect, useCallback, useRef } from 'react'

import { ethers } from "ethers"
import MainContractABI from "../../abis/MainContract.json"
import { MAINCONTRACTADDRESS } from '../../constants'


const SetupVotes = () => {
    const { currentAccount } = JSON.parse(localStorage.getItem("userData"))
    const [numberOfVotes, setNumberOfVotes] = useState(0)

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const instanceMainContract = useRef(new ethers.Contract(MAINCONTRACTADDRESS, MainContractABI.abi, signer))


    const getMerchantInfo = useCallback(async () => {
        const instanceMainContract2 = instanceMainContract.current

        try {
            const numberOfVotes = await instanceMainContract2.getRequiredNumberOfVotes()
            setNumberOfVotes(numberOfVotes)
        } catch (error) {
            console.log("ERROR AT GETTING MERCHANT INFO: ", error)
        }
    }, [])

    async function setupVotes() {
        if (numberOfVotes <= 0) {
            alert("Should be greater than 0!")
            return
        }

        try {
            const instanceMainContract2 = instanceMainContract.current
            const ownerChangeRequiredNumberOfVotes = await instanceMainContract2.changeRequiredNumberOfVotes(numberOfVotes, { from: currentAccount })
            console.log("Owner Change Required Number Of Votes: ", ownerChangeRequiredNumberOfVotes)

            document.getElementById("done-successfully-2").style.display = ''
        } catch (error) {
            console.log("ERROR AT CHANGING REQUIRED NUMBER OF VOTES: ", error)
        }

        setTimeout(function () {
            document.getElementById("done-successfully-2").style.display = 'none'
        }, 2000)
    }


    useEffect(() => {
        getMerchantInfo()
    }, [getMerchantInfo])


    return (
        <>
            <h1>Setup Votes</h1>

            <div id="page-wrap">
                <label htmlFor="RequiredNumberOfVotes">Required Number of Votes: </label>
                <input
                    type="text"
                    placeholder="Insert Required Number of Votes"
                    value={numberOfVotes}
                    style={{ width: "5%" }}
                    onChange={(e) => setNumberOfVotes(e.target.value)}
                />
                <br />

                <button onClick={() => setupVotes()}>Confirm</button>
                <br />

                <span id="done-successfully-2" style={{ "display": "none" }}>Merchant added successfully!</span>
            </div>
        </>
    )
}

export default SetupVotes

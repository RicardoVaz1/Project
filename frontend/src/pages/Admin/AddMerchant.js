import { useState } from 'react'

import { ethers } from "ethers"
import MainContractABI from "../../abis/MainContract.json"
import { MAINCONTRACTADDRESS } from '../../constants'


const AddMerchant = () => {
    const { currentAccount } = JSON.parse(localStorage.getItem("userData"))
    const [merchantAddress, setMerchantAddress] = useState("")
    const [merchantName, setMerchantName] = useState("")

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const instanceMainContract = new ethers.Contract(MAINCONTRACTADDRESS, MainContractABI.abi, signer)


    async function createMerchant() {
        if (merchantAddress === "" || merchantName === "") {
            alert("Fill all fields!")
            return
        }

        try {
            const ownerAddMerchant = await instanceMainContract.createMerchantContract(merchantAddress, merchantName, { from: currentAccount })
            console.log("Owner Add Merchant: ", ownerAddMerchant)

            document.getElementById("done-successfully").style.display = ''
        } catch (error) {
            console.log("ERROR AT CREATING NEW MERCHANT: ", error)
        }

        setTimeout(function () {
            document.getElementById("done-successfully").style.display = 'none'
        }, 2000)
    }


    return (
        <>
            <h1>Create MerchantContract</h1>

            <div id="page-wrap">
                <label htmlFor="merchantAddress">Merchant Address:</label>
                <input
                    type="text"
                    id="merchantAddress"
                    name="fname"
                    placeholder="Insert Merchant Address"
                    onChange={(e) => setMerchantAddress(e.target.value)}
                />
                <br />

                <label htmlFor="merchantName">Merchant Name: </label>
                <input
                    type="text"
                    id="merchantName"
                    name="lname"
                    placeholder="Insert Merchant Name"
                    onChange={(e) => setMerchantName(e.target.value)}
                />
                <br />

                <button onClick={() => createMerchant()}>Create MerchantContract</button>
                <br />

                <span id="done-successfully" style={{ "display": "none" }}>Merchant added successfully!</span>
            </div>
        </>
    )
}

export default AddMerchant

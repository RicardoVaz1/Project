import { useState, useEffect } from "react"

import { ethers } from "ethers"
import MerchantContractABI from "../../abis/MerchantContract.json"
// import { MERCHANTCONTRACTADDRESS } from '../../constants'


const AdminApproveMerchant = () => {
    const { /*currentAccount,*/ MerchantContractAddress } = JSON.parse(localStorage.getItem("userData"))
    const [adminAccount, setAdminAccount] = useState("")

    useEffect(() => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
    
        provider.send("eth_requestAccounts", [])
            .then((accounts) => {
                if (accounts.length > 0) {
                    setAdminAccount(accounts[0])
                }
            })
            .catch((e) => console.log(e))
      }, [adminAccount])

    async function approveMerchant() {
        // console.log("adminAccount: ", adminAccount)

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner(adminAccount)
        const instanceMerchantContract = new ethers.Contract(MerchantContractAddress, MerchantContractABI.abi, signer)

        try {
            const AdminApproveMerchant = await instanceMerchantContract.approveMerchant({ from: adminAccount, gasLimit: 1500000 })
            console.log("Admin Approve Merchant: ", AdminApproveMerchant)

            document.getElementById("done-successfully-1").style.display = ''
        } catch (error) {
            console.log("ERROR AT APPROVING NEW PURCHASE: ", error)
        }

        setTimeout(function () {
            document.getElementById("done-successfully-1").style.display = 'none'
        }, 2000)
    }

    return (
        <>
            <br />
            <br />
            <h3>(Admin only) ApproveMerchant</h3>

            <button onClick={() => approveMerchant()}>Approve!</button>

            <span id="done-successfully-1" style={{ "display": "none" }}>Done successfully!</span>
        </>
    )
}

export default AdminApproveMerchant

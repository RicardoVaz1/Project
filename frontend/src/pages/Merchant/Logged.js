import { useState, useEffect, useCallback, useRef } from 'react'

// import Sidebar from '../../components/Sidebar'
import PersonalInfo from './PersonalInfo'
import CreatePurchase from './CreatePurchase'
import PurchasesList from './PurchasesList'
import Refunds from './Refunds'
import TopUpMyContract from './TopUpMyContract'
import Withdrawals from './Withdrawals'

import { ethers } from "ethers"
import MerchantContractABI from "../../abis/MerchantContract.json"
// import AdminApproveMerchant from './AdminApproveMerchant'
// import { MERCHANTCONTRACTADDRESS } from '../../constants'


const Logged = () => {
    const data = JSON.parse(localStorage.getItem("userData"))
    const CurrentAccount = data.currentAccount
    // const Balance = data.balance
    const MerchantContractAddress = data.MerchantContractAddress
    const MerchantContractApprovedStatus = data.MerchantContractApprovedStatus

    const [name, setName] = useState("")

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const instanceMerchantContract = useRef(new ethers.Contract(MerchantContractAddress, MerchantContractABI.abi, signer))


    const getMerchantInfo = useCallback(async () => {
        const instanceMerchantContract2 = instanceMerchantContract.current

        try {
            const merchantName = await instanceMerchantContract2.checkMyName({ from: CurrentAccount })
            // console.log("Merchant Name: ", merchantName)

            setName(merchantName)
        } catch (error) {
            console.log("ERROR AT GETTING MERCHANT NAME: ", error)
        }
    }, [CurrentAccount])

    useEffect(() => {
        getMerchantInfo()
    }, [getMerchantInfo])


    useEffect(() => {
        document.getElementById("Merchant").setAttribute("style", "font-weight: bold; color: yellow !important;")
        document.getElementById("Admin").setAttribute("style", "font-weight: normal; color: white !important;")
    }, [])


    return (
        <>
            {MerchantContractApprovedStatus ?
                <h1>Welcome {name}, {CurrentAccount.slice(0, 5)}...{CurrentAccount.slice(38)}!</h1> :
                <>
                    <h1>Welcome, {CurrentAccount.slice(0, 5)}...{CurrentAccount.slice(38)}!</h1>
                    <h4 style={{ color: "red", textDecoration: "underline" }}>MerchantContract not approved!</h4>
                </>
            }

            {/* <Sidebar logged={"merchant"} /> */}

            <div id="page-wrap">
                <PersonalInfo />
                <CreatePurchase />
                <PurchasesList />
                <Withdrawals />
                <Refunds />
                <TopUpMyContract />
                {/* <AdminApproveMerchant /> */}
            </div>

            <br />
            <br />
        </>
    )
}

export default Logged

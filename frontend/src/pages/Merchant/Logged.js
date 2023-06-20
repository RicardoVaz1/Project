import { useState, useEffect, useCallback, useRef } from 'react'

import PersonalInfo from './PersonalInfo'
import CreatePurchase from './CreatePurchase'
import PurchasesList from './PurchasesList'
import Refunds from './Refunds'
import Withdrawals from './Withdrawals'

import { ethers } from "ethers"
import MerchantContractABI from "../../abis/MerchantContract.json"


const Logged = () => {
    const data = JSON.parse(localStorage.getItem("userData"))
    const CurrentAccount = data.currentAccount
    const chainName = data.chainName
    const MerchantContractAddress = data.MerchantContractAddress
    const MerchantContractApprovedStatus = data.MerchantContractApprovedStatus
    const [name, setName] = useState("")

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const instanceMerchantContract = useRef(new ethers.Contract(MerchantContractAddress, MerchantContractABI.abi, signer))


    const getMerchantInfo = useCallback(async () => {
        const instanceMerchantContract2 = instanceMerchantContract.current

        try {
            const merchantName = await instanceMerchantContract2.getName({ from: CurrentAccount })
            setName(merchantName)
        } catch (error) {
            console.log("ERROR AT GETTING MERCHANT NAME: ", error)
        }
    }, [CurrentAccount])


    useEffect(() => {
        document.getElementById("Merchant").setAttribute("style", "font-weight: bold; color: yellow !important;")
        document.getElementById("Admin").setAttribute("style", "font-weight: normal; color: white !important;")
    }, [])

    useEffect(() => {
        getMerchantInfo()
    }, [getMerchantInfo])


    return (
        <>
            {MerchantContractApprovedStatus ?
                <h1>Welcome <a href={`https://${chainName}.etherscan.io/address/${MerchantContractAddress}`} target="_blank" rel="noreferrer" >{name}</a>, {CurrentAccount.slice(0, 5)}...{CurrentAccount.slice(38)}!</h1> :
                <>
                    <h1>Welcome, {CurrentAccount.slice(0, 5)}...{CurrentAccount.slice(38)}!</h1>
                    <h4 style={{ color: "red", textDecoration: "underline" }}>MerchantContract not approved!</h4>
                </>
            }

            <div id="page-wrap">
                <PersonalInfo />
                <CreatePurchase />
                <PurchasesList />
                <Withdrawals />
                <Refunds />
            </div>

            <br />
            <br />
        </>
    )
}

export default Logged

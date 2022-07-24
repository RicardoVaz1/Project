import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import * as constants from '../../constants'

import Sidebar from '../../components/Sidebar'
import PersonalInfo from './PersonalInfo'
import CreatePurchase from './CreatePurchase'
import PurchasesList from './PurchasesList'
import Refunds from './Refunds'
import TopUpMyContract from './TopUpMyContract'
import Withdrawals from './Withdrawals'

import { ethers } from "ethers"
import MerchantContractABI from "../../abis/MerchantContract.json"
const ContractAddress = constants.CONTRACTADDRESS


const Logged = () => {
    const [searchparams] = useSearchParams()
    let CurrentAccount = searchparams.get("CurrentAccount")
    // let Balance = searchparams.get("Balance")

    const [name, setName] = useState("")

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const instanceMerchantContract = new ethers.Contract(ContractAddress, MerchantContractABI.abi, signer)

    useEffect(() => {
        getMerchantInfo()
    })

    async function getMerchantInfo() {
        try {
            const merchantName = await instanceMerchantContract.hello() // checkMyName().call({from: currentAccount})
            console.log("Merchant Name: ", merchantName)

            setName(merchantName)
        } catch (error) {
            console.log("ERROR AT GETTING MERCHANT NAME: ", error)
        }
    }

    return (
        <>
            <h1>Welcome {name}, {CurrentAccount.slice(0, 5)}...{CurrentAccount.slice(38)}!</h1>

            <Sidebar logged={"merchant"} />

            <div id="page-wrap">
                <PersonalInfo currentAccount={CurrentAccount} />
                <CreatePurchase currentAccount={CurrentAccount} />
                <PurchasesList currentAccount={CurrentAccount} />
                <Withdrawals currentAccount={CurrentAccount} />
                <Refunds currentAccount={CurrentAccount} />
                <TopUpMyContract currentAccount={CurrentAccount} />
            </div>

            <br />
            <br />
        </>
    )
}

export default Logged

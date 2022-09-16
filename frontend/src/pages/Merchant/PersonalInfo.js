import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from "react-router-dom"

import { ethers } from "ethers"
import MerchantContractABI from "../../abis/MerchantContract.json"


const PersonalInfo = () => {
    const navigate = useNavigate()
    const { currentAccount, MerchantContractAddress } = JSON.parse(localStorage.getItem("userData"))
    const [walletAddress, setWalletAddress] = useState("")
    const [name, setName] = useState("")
    const [escrowAmount, setEscrowAmount] = useState(0)
    const [balance, setBalance] = useState(0)

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const instanceMerchantContract = useRef(new ethers.Contract(MerchantContractAddress, MerchantContractABI.abi, signer))


    const getMerchantInfo = useCallback(async () => {
        const instanceMerchantContract2 = instanceMerchantContract.current

        try {
            const merchantAddress = await instanceMerchantContract2.checkMyAddress({ from: currentAccount })
            const merchantName = await instanceMerchantContract2.checkMyName({ from: currentAccount })
            const merchantEscrowAmount = await instanceMerchantContract2.checkMyEscrowAmount({ from: currentAccount })
            const merchantBalance = await instanceMerchantContract2.checkMyBalance({ from: currentAccount })

            setWalletAddress(merchantAddress)
            setName(merchantName)
            setEscrowAmount(merchantEscrowAmount)
            setBalance(merchantBalance)
        } catch (error) {
            console.log("ERROR AT GETTING MERCHANT INFO: ", error)
        }
    }, [currentAccount])

    async function changeAddress() {
        if (walletAddress === "") {
            alert("Fill the wallet address!")
            return
        }

        try {
            const merchantNewAddress = await instanceMerchantContract.changeMyAddress(walletAddress, { from: currentAccount })
            console.log("Merchant New Address: ", merchantNewAddress)

            setWalletAddress(merchantNewAddress)
            document.getElementById("done-successfully").style.display = ''
        } catch (error) {
            console.log("ERROR AT GETTING MERCHANT INFO: ", error)
        }

        setTimeout(function () {
            document.getElementById("done-successfully").style.display = 'none'
            navigate("/")
        }, 2000)
    }


    useEffect(() => {
        getMerchantInfo()
    }, [getMerchantInfo])


    return (
        <>
            <h3>MerchantContract Info</h3>

            <label htmlFor="walletAddress">Address:</label>
            <input
                type="text"
                id="walletAddress"
                name="fname"
                placeholder="Insert your wallet address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
            />
            <button onClick={() => changeAddress()}>Change</button>
            <br />

            <label htmlFor="name">Name: </label>
            <span>{name}</span>
            <br />

            <label htmlFor="escrowAmount">Escrow Amount: </label>
            <span>{escrowAmount >= 10 ** 18 ? escrowAmount / 10 ** 18 + " ETH" : escrowAmount + " Wei"}</span>
            <br />

            <label htmlFor="balance">Balance: </label>
            <span>{balance >= 10 ** 18 ? balance / 10 ** 18 + " ETH" : balance + " Wei"}</span>

            <span id="done-successfully" style={{ "display": "none" }}>Done successfully!</span>
        </>
    )
}

export default PersonalInfo

import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from "react-router-dom"

import { ethers } from "ethers"
import MainContractABI from "../../abis/MainContract.json"
import { MAINCONTRACTADDRESS } from '../../constants'
const axios = require("axios")


const ConnectWallet = ({ nextPage }) => {
  const navigate = useNavigate()
  // const OwnerAddress = process.env.REACT_APP_OWNER_ADDRESS
  const [ownerAddress, setOwnerAddress] = useState("")

  const [balance, setBalance] = useState("")
  const [currentAccount, setCurrentAccount] = useState("")
  const [chainID, setChainID] = useState(0)
  const [chainName, setChainName] = useState("")
  const [currentBlock, setCurrentBlock] = useState(0)

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner(process.env.REACT_APP_OWNER_ADDRESS)
  // const instanceMainContract = new ethers.Contract(MAINCONTRACTADDRESS, MainContractABI.abi, signer)
  const instanceMainContract = useRef(new ethers.Contract(MAINCONTRACTADDRESS, MainContractABI.abi, signer))



  const checkIsAdmin = useCallback(async () => {
    const instanceMainContract2 = instanceMainContract.current

    try {
      const OwnerAddress = await instanceMainContract2.getOwnerAddress({ from: process.env.REACT_APP_OWNER_ADDRESS })
      // console.log("Owner Address: ", OwnerAddress)

      setOwnerAddress(OwnerAddress)
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    if (!currentAccount || !ethers.utils.isAddress(currentAccount)) return
    if (!window.ethereum) return

    const provider = new ethers.providers.Web3Provider(window.ethereum)

    provider.getBalance(currentAccount).then((result) => {
      setBalance(ethers.utils.formatEther(result) + " ETH")
    })

    provider.getNetwork().then((result) => {
      setChainID(result.chainId)
      setChainName(result.name)
    })

    provider.getBlockNumber(currentAccount).then((result) => {
      setCurrentBlock(result)
    })
  }, [currentAccount])

  useEffect(() => {
    checkIsAdmin()
  }, [checkIsAdmin])


  function onClickConnect() {
    if (!window.ethereum) {
      alert("Please install MetaMask!")
      console.log("Please install MetaMask!")
      return
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum)

    provider.send("eth_requestAccounts", [])
      .then((accounts) => {
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0])
        }
      })
      .catch((e) => console.log(e))
  }

  /* function onClickDisconnect() {
    console.log("Disconnect!")
    setBalance(undefined)
    setCurrentAccount(undefined)
    setChainID(0)
    setChainName(undefined)
    setCurrentBlock(0)
  } */

  async function pageNext() {
    let MerchantContractAddress
    let MerchantContractApprovedStatus
    let isAdmin

    // console.log("x: ", currentAccount)
    // console.log("y: ", ownerAddress)
    // console.log("result: ", currentAccount.toLowerCase() === ownerAddress.toLowerCase())

    if (currentAccount.toLowerCase() === ownerAddress.toLowerCase() && nextPage === "/admin") {
      isAdmin = true
      localStorage.setItem("userData", JSON.stringify({ currentAccount, balance, chainID, chainName, currentBlock, isAdmin }))
      navigate(nextPage)
    }
    else {
      MerchantContractAddress = await getMerchantContractAddress(currentAccount)
      MerchantContractApprovedStatus = await getMerchantContractApprovedStatus(MerchantContractAddress)

      if (MerchantContractApprovedStatus !== true) MerchantContractApprovedStatus = false
      // console.log("MerchantContractAddress: ", MerchantContractAddress)
      // console.log("MerchantContractApprovedStatus: ", MerchantContractApprovedStatus)

      if (MerchantContractAddress) {
        isAdmin = false
        localStorage.setItem("userData", JSON.stringify({ currentAccount, balance, chainID, chainName, currentBlock, MerchantContractAddress, MerchantContractApprovedStatus, isAdmin }))
        navigate(nextPage)
      } else {
        document.getElementById("done-successfully").style.display = ''

        setTimeout(function () {
          document.getElementById("done-successfully").style.display = 'none'
        }, 2000)
      }
    }
  }

  const getMerchantContractAddress = async (MerchantAddress) => {
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_THE_GRAPH_API}`,
        {
          query: `
                {
                    createdMerchantContracts(first: 1, where: {MerchantAddress: "${MerchantAddress}"}) {
                        id
                        MerchantContractAddress
                        MerchantAddress
                        MerchantName
                    }
                }
                `
        }
      )

      let MerchantContractAddress = result.data.data.createdMerchantContracts[0].MerchantContractAddress
      // console.log("MerchantContractAddress: ", MerchantContractAddress)

      return MerchantContractAddress
    } catch (error) {
      console.log(error)
    }
  }

  const getMerchantContractApprovedStatus = async (MerchantContractAddress) => {
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_THE_GRAPH_API}`,
        {
          query: `
                {
                  approvedMerchantContracts(first: 1, where: {MerchantContractAddress: "${MerchantContractAddress}"}) {
                        id
                        MerchantContractAddress
                        Approved
                    }
                }
                `
        }
      )

      let MerchantContractApprovedStatus = result.data.data.approvedMerchantContracts[0].Approved
      // console.log("MerchantContractApprovedStatus: ", MerchantContractApprovedStatus)

      return MerchantContractApprovedStatus
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (nextPage === "/admin") {
      document.getElementById("Buyer").setAttribute("style", "font-weight: normal; color: white !important;")
      document.getElementById("Merchant").setAttribute("style", "font-weight: normal; color: white !important;")
      document.getElementById("Admin").setAttribute("style", "font-weight: bold; color: yellow !important;")
      document.getElementById("Vote").setAttribute("style", "font-weight: normal; color: white !important;")
    }
    else {
      document.getElementById("Buyer").setAttribute("style", "font-weight: normal; color: white !important;")
      document.getElementById("Merchant").setAttribute("style", "font-weight: bold; color: yellow !important;")
      document.getElementById("Admin").setAttribute("style", "font-weight: normal; color: white !important;")
      document.getElementById("Vote").setAttribute("style", "font-weight: normal; color: white !important;")
    }
  }, [nextPage])

  return (
    <>
      {!currentAccount || !ethers.utils.isAddress(currentAccount) ?
        <button onClick={() => onClickConnect()}>Connect Metamask</button> :
        <>
          <span><b>Address: </b>{currentAccount}</span>
          <br />

          <span><b>Balance: </b>{balance}</span>
          <br />

          <span><b>Chain ID: </b>{chainID}</span>
          <br />

          <span><b>Chain Name: </b>{chainName}</span>
          <br />

          <span><b>Current Block: </b>{currentBlock}</span>
          <br />
          <br />

          <button onClick={pageNext}>
            Next
          </button>

          <span id="done-successfully" style={{ display: "none", color: "red" }}>Merchant doesn't exist!</span>
        </>
      }
    </>
  )
}

export default ConnectWallet

import React, { useState, useEffect } from 'react'
import { ethers } from "ethers"
// import { useNavigate } from "react-router-dom";


const ConnectWallet = (props) => {
  // const navigate = useNavigate();

  const [balance, setBalance] = useState("")
  const [currentAccount, setCurrentAccount] = useState("")
  const [chainID, setChainID] = useState(0)
  const [chainName, setChainName] = useState("")
  const [currentBlock, setCurrentBlock] = useState(0)


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
      console.log(result)
      setCurrentBlock(result)
    })
  }, [currentAccount])


  function onClickConnect() {
    if (!window.ethereum) {
      alert("Please install MetaMask!")
      console.log("Please install MetaMask!")
      return
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum)

    provider.send("eth_requestAccounts", [])
      .then((accounts) => {
        if (accounts.length > 0) setCurrentAccount(accounts[0])

        // if (props.nextPage === "/logged") navigate("/logged", { state: { query: ' your-query ' } })
        // if (props.nextPage === "/admin-logged") navigate("/admin-logged")
      })
      .catch((e) => console.log(e))
  }

  function onClickDisconnect() {
    console.log("Disconnect!")
    setBalance(undefined)
    setCurrentAccount(undefined)
    setChainID(0)
    setChainName(undefined)
    setCurrentBlock(0)
  }

  return (
    <div>
      {!currentAccount || !ethers.utils.isAddress(currentAccount) ?
        <button onClick={() => onClickConnect()}>Connect Metamask</button> :
        <div>
          <button onClick={() => onClickDisconnect()}>Disconnect</button>
          <br />

          <span>Current Account: {currentAccount}</span>
          <br />

          <span>Balance: {balance}</span>
          <br />

          <span>Chain ID: {chainID}</span>
          <br />

          <span>Chain Name: {chainName}</span>
          <br />

          <span>Current Block: {currentBlock}</span>
          <br />
        </div>
      }
    </div>
  )
}

export default ConnectWallet

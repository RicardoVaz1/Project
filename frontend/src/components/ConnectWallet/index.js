import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { createSearchParams, useNavigate } from "react-router-dom"

const ConnectWallet = ({ nextPage }) => {
  const navigate = useNavigate()

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

          <button onClick={() => navigate({
            pathname: nextPage,
            search: createSearchParams({
              CurrentAccount: currentAccount,
              Balance: balance
            }).toString()
          })}>
            Next
          </button>
        </>
      }
    </>
  )
}

export default ConnectWallet

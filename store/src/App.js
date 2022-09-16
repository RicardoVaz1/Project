import { useState, useEffect, useCallback, useRef } from 'react'
import './App.css'

import { ethers } from "ethers"
import MerchantContractABI from "./abis/MerchantContract.json"


function App() {
  const MerchantContractAddress = process.env.REACT_APP_MERCHANTCONTRACT_ADDRESS
  const MerchantAddress = process.env.REACT_APP_MERCHANT_ADDRESS
  const [productsList, setProductsList] = useState([])
  const [currentAccount, setCurrentAccount] = useState("")
  const [chainID, setChainID] = useState(5)

  const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL, chainID)
  const signer = new ethers.Wallet(process.env.REACT_APP_MERCHANT_ADDRESS_PK, provider)
  const instanceMerchantContract = useRef(new ethers.Contract(MerchantContractAddress, MerchantContractABI.abi, signer))

  let provider2


  function setListOfProducts() {
    let listOfProducts = [
      { IDPurchase: 1, PurchaseAmount: 10, EscrowTime: 10 },
      { IDPurchase: 2, PurchaseAmount: 20, EscrowTime: 20 },
      { IDPurchase: 3, PurchaseAmount: 30, EscrowTime: 30 },
      { IDPurchase: 4, PurchaseAmount: 40, EscrowTime: 40 },
      { IDPurchase: 5, PurchaseAmount: 50, EscrowTime: 50 },
      { IDPurchase: 6, PurchaseAmount: 60, EscrowTime: 60 },
      { IDPurchase: 7, PurchaseAmount: 70, EscrowTime: 70 },
      { IDPurchase: 8, PurchaseAmount: 80, EscrowTime: 80 },
      { IDPurchase: 9, PurchaseAmount: 90, EscrowTime: 90 },
      { IDPurchase: 10, PurchaseAmount: 100, EscrowTime: 100 },
    ]

    setProductsList(listOfProducts)
  }

  const getMerchantContractInfo = useCallback(async () => {
    const instanceMerchantContract2 = instanceMerchantContract.current

    for (let i = 0; i < productsList.length; i++) {
      const IDPurchase = productsList[i].IDPurchase

      try {
        const purchase_status = await instanceMerchantContract2.getPurchaseStatus(IDPurchase)
        let purchase_status_int = parseInt(purchase_status, 16)

        if (purchase_status_int === 0) {
          document.getElementById(`${IDPurchase}_status`).textContent = "Not Created"
          document.getElementById(`${IDPurchase}_button`).setAttribute("style", "display: table-cell;")
        }

        if (purchase_status_int === 1) {
          document.getElementById(`${IDPurchase}_status`).textContent = "Not Paid"
          document.getElementById(`${IDPurchase}_button`).setAttribute("style", "display: table-cell;")
        }

        if (purchase_status_int === 2) {
          document.getElementById(`${IDPurchase}_status`).textContent = "Paid"
        }

        if (purchase_status_int === 3) {
          document.getElementById(`${IDPurchase}_status`).textContent = "Completed"
        }

        if (purchase_status_int === 4) {
          document.getElementById(`${IDPurchase}_status`).textContent = "Refunded"
        }
      } catch (error) {
        console.log("ERROR AT GETTING MERCHANT CONTRACT INFO: ", error)
      }
    }
  }, [productsList])

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Please install MetaMask!")
      return
    }

    provider2 = new ethers.providers.Web3Provider(window.ethereum)

    provider2.send("eth_requestAccounts", [])
      .then((accounts) => {
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0])
        }
      })
      .catch((e) => console.log(e))

    provider2.getNetwork().then((result) => {
      setChainID(result.chainId)
    })
  }

  async function buy(idPurchase, purchaseAmount, escrowTime) {
    const instanceMerchantContract2 = instanceMerchantContract.current

    provider2 = new ethers.providers.Web3Provider(window.ethereum)
    const signer2 = provider2.getSigner()
    const buyerInstanceMerchantContract = new ethers.Contract(MerchantContractAddress, MerchantContractABI.abi, signer2)

    try {
      const MerchantCreatePurchase = await instanceMerchantContract2.createPurchase(idPurchase, purchaseAmount, escrowTime, { from: MerchantAddress, gasLimit: 1500000 })
      console.log("Merchant Create Purchase: ", MerchantCreatePurchase)

      const BuyerNewBuy = await buyerInstanceMerchantContract.buy(idPurchase, { from: currentAccount, value: purchaseAmount, gasLimit: 1500000 })
      console.log("Buyer New Buy: ", BuyerNewBuy)

      document.getElementById("done-successfully").style.display = ''
    } catch (error) {
      console.log("ERROR AT BUYING THE PURCHASE: ", error)
    }

    setTimeout(function () {
      document.getElementById("done-successfully").style.display = 'none'
    }, 2000)
  }


  useEffect(() => {
    setListOfProducts()
  }, [])

  useEffect(() => {
    getMerchantContractInfo()
  }, [getMerchantContractInfo])

  useEffect(() => {
    if (!currentAccount || !ethers.utils.isAddress(currentAccount)) return
    if (!window.ethereum) return
  }, [currentAccount])


  return (
    <div className="App">
      <h1>Merchant #{MerchantContractAddress.slice(0, 5)}...{MerchantContractAddress.slice(38)}: Products List</h1>

      <table className="table">
        <thead>
          <tr>
            <th>ID Purchase</th>
            <th>Purchase Amount</th>
            <th>Escrow Time</th>
            <th>Purchase Status</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {productsList.map((item, i) => {
            return (
              <tr className="item" key={i}>
                <td className="itemDisplay">{item.IDPurchase}</td>
                <td className="itemDisplay">{item.PurchaseAmount}</td>
                <td className="itemDisplay">{item.EscrowTime}</td>
                <td className="itemDisplay" id={`${item.IDPurchase}_status`}>-</td>
                <td className="itemButton" id={`${item.IDPurchase}_button`} style={{ display: "none" }}>
                  {!currentAccount ?
                    <button onClick={() => connectWallet()}>Connect Wallet</button> :
                    <button onClick={() => buy(item.IDPurchase, item.PurchaseAmount, item.EscrowTime)}>Buy</button>
                  }
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <br />

      <span id="done-successfully" style={{ "display": "none" }}>Done successfully!</span>
    </div>
  )
}

export default App

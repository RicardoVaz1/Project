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
      { idPurchase: 1, purchaseAmount: 10, cancelTime: 10, completeTime: 10 },
      { idPurchase: 2, purchaseAmount: 20, cancelTime: 20, completeTime: 20 },
      { idPurchase: 3, purchaseAmount: 30, cancelTime: 30, completeTime: 30 },
      { idPurchase: 4, purchaseAmount: 40, cancelTime: 40, completeTime: 40 },
      { idPurchase: 5, purchaseAmount: 50, cancelTime: 50, completeTime: 50 },
      { idPurchase: 6, purchaseAmount: 60, cancelTime: 60, completeTime: 60 },
      { idPurchase: 7, purchaseAmount: 70, cancelTime: 70, completeTime: 70 },
      { idPurchase: 8, purchaseAmount: 80, cancelTime: 80, completeTime: 80 },
      { idPurchase: 9, purchaseAmount: 90, cancelTime: 90, completeTime: 90 },
      { idPurchase: 10, purchaseAmount: 100, cancelTime: 100, completeTime: 200 },
      { idPurchase: 11, purchaseAmount: 110, cancelTime: 150, completeTime: 300 },
      { idPurchase: 12, purchaseAmount: 120, cancelTime: 200, completeTime: 400 },
      { idPurchase: 13, purchaseAmount: 130, cancelTime: 300, completeTime: 500 },
      { idPurchase: 14, purchaseAmount: 140, cancelTime: 400, completeTime: 600 },
      { idPurchase: 15, purchaseAmount: 150, cancelTime: 500, completeTime: 700 },
      { idPurchase: 16, purchaseAmount: 100, cancelTime: 1000, completeTime: 1200 },
      { idPurchase: 17, purchaseAmount: 100, cancelTime: 1500, completeTime: 1600 },
      { idPurchase: 18, purchaseAmount: 100, cancelTime: 2000, completeTime: 2200 },
      { idPurchase: 19, purchaseAmount: 100, cancelTime: 2500, completeTime: 2500 },
      { idPurchase: 20, purchaseAmount: 100, cancelTime: 3000, completeTime: 3500 },
    ]

    setProductsList(listOfProducts)
  }

  const getMerchantContractInfo = useCallback(async () => {
    const instanceMerchantContract2 = instanceMerchantContract.current

    for (let i = 0; i < productsList.length; i++) {
      const idPurchase = productsList[i].idPurchase

      try {
        const purchase_status = await instanceMerchantContract2.purchaseStatus(idPurchase)
        let purchase_status_int = parseInt(purchase_status, 16)

        if (purchase_status_int === 0) {
          document.getElementById(`${idPurchase}_status`).textContent = "Not Created"
          document.getElementById(`${idPurchase}_button`).setAttribute("style", "display: table-cell;")
          document.getElementById(`${idPurchase}_buy`).setAttribute("style", "display: table-cell;")
        }

        if (purchase_status_int === 1) {
          document.getElementById(`${idPurchase}_status`).textContent = "Not Paid"
          document.getElementById(`${idPurchase}_button`).setAttribute("style", "display: table-cell;")
          document.getElementById(`${idPurchase}_buy`).setAttribute("style", "display: table-cell;")
        }

        if (purchase_status_int === 2) {
          document.getElementById(`${idPurchase}_status`).textContent = "Paid"
          document.getElementById(`${idPurchase}_button`).setAttribute("style", "display: table-cell;")
          document.getElementById(`${idPurchase}_cancel`).setAttribute("style", "display: table-cell;")
        }

        if (purchase_status_int === 3) {
          document.getElementById(`${idPurchase}_status`).textContent = "Completed"
        }

        if (purchase_status_int === 4) {
          document.getElementById(`${idPurchase}_status`).textContent = "Refunded"
        }

        if (purchase_status_int === 5) {
          document.getElementById(`${idPurchase}_status`).textContent = "Canceled"
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

    getMerchantContractInfo()
  }

  async function buy(idPurchase, purchaseAmount, cancelTime, completeTime) {
    const instanceMerchantContract2 = instanceMerchantContract.current

    provider2 = new ethers.providers.Web3Provider(window.ethereum)
    const signer2 = provider2.getSigner()
    const buyerInstanceMerchantContract = new ethers.Contract(MerchantContractAddress, MerchantContractABI.abi, signer2)

    const _purchaseStatus = await getPurchaseStatus(idPurchase)

    try {
      if(_purchaseStatus > 1) {
        console.log("idPurchase: " + idPurchase +", purchaseStatus: ", _purchaseStatus)
        console.log("Purchase must exist and has not yet been paid! (state: 0 or 1)")
        return
      }

      const MerchantCreatePurchase = await instanceMerchantContract2.createPurchase(idPurchase, purchaseAmount, cancelTime, completeTime, { from: MerchantAddress, gasLimit: 1500000 })
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

  async function cancel(idPurchase) {
    provider2 = new ethers.providers.Web3Provider(window.ethereum)
    const signer2 = provider2.getSigner()
    const buyerInstanceMerchantContract = new ethers.Contract(MerchantContractAddress, MerchantContractABI.abi, signer2)

    const _purchaseStatus = await getPurchaseStatus(idPurchase)

    try {
      if(_purchaseStatus !== 2) {
        console.log("idPurchase: " + idPurchase +", purchaseStatus: ", _purchaseStatus)
        console.log("Purchase must be in payed state! (state: 2)")
        return
      }

      const BuyerNewCancel = await buyerInstanceMerchantContract.cancel(idPurchase, { from: currentAccount, gasLimit: 1500000 })
      console.log("Buyer New Cancel: ", BuyerNewCancel)

      document.getElementById("done-successfully").style.display = ''
    } catch (error) {
      console.log("ERROR AT CANCELING THE PURCHASE: ", error)
    }

    setTimeout(function () {
      document.getElementById("done-successfully").style.display = 'none'
    }, 2000)
  }

  async function getPurchaseStatus(idPurchase) {
    provider2 = new ethers.providers.Web3Provider(window.ethereum)
    const signer2 = provider2.getSigner()
    const buyerInstanceMerchantContract = new ethers.Contract(MerchantContractAddress, MerchantContractABI.abi, signer2)
    let BuyerGetPurchaseStatus

    try {
      BuyerGetPurchaseStatus = await buyerInstanceMerchantContract.purchaseStatus(idPurchase, { from: currentAccount, gasLimit: 1500000 })
      console.log("Buyer Get Purchase Status: ", BuyerGetPurchaseStatus.toNumber())

      document.getElementById("done-successfully").style.display = ''
    } catch (error) {
      console.log("ERROR AT CANCELING THE PURCHASE: ", error)
    }

    return BuyerGetPurchaseStatus.toNumber()
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
            <th>Cancel Time</th>
            <th>Complete Time</th>
            <th>Purchase Status</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {productsList.map((item, i) => {
            return (
              <tr className="item" key={i}>
                <td className="itemDisplay">{item.idPurchase}</td>
                <td className="itemDisplay">{item.purchaseAmount}</td>
                <td className="itemDisplay">{item.cancelTime}</td>
                <td className="itemDisplay">{item.completeTime}</td>
                <td className="itemDisplay" id={`${item.idPurchase}_status`}>-</td>
                <td className="itemButton" id={`${item.idPurchase}_button`} style={{ display: "none" }}>
                  {!currentAccount ?
                    <button onClick={() => connectWallet()}>Connect Wallet</button> :
                    <>
                      <button onClick={() => buy(item.idPurchase, item.purchaseAmount, item.cancelTime, item.completeTime)} id={`${item.idPurchase}_buy`} style={{ display: "none" }}>Buy</button>
                      <button onClick={() => cancel(item.idPurchase)} id={`${item.idPurchase}_cancel`} style={{ display: "none" }}>Cancel</button>
                    </>
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

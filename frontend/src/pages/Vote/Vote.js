import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from "react-router-dom"

import { ethers } from "ethers"
import MainContractABI from "../../abis/MainContract.json"
import { MAINCONTRACTADDRESS } from '../../constants'
const axios = require("axios")


const Vote = () => {
  const navigate = useNavigate()
  const [merchantsList, setMerchantsList] = useState([])
  const merchantsInfo = useState([])

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner(process.env.REACT_APP_OWNER_ADDRESS)
  const instanceMainContract = useRef(new ethers.Contract(MAINCONTRACTADDRESS, MainContractABI.abi, signer))


  async function getMerchantsList() {
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_THE_GRAPH_API}`,
        {
          query: `
                  {
                      createdMerchantContracts(orderBy: id, orderDirection: desc) {
                          id
                          MerchantContractAddress
                          MerchantAddress
                          MerchantName
                      }
                  }
                  `
        }
      )

      let MerchantsList = result.data.data.createdMerchantContracts
      setMerchantsList(MerchantsList)
    } catch (error) {
      console.log(error)
    }
  }

  const getMerchantContractInfo = useCallback(async () => {
    const instanceMainContract2 = instanceMainContract.current

    for (let i = 0; i < merchantsList.length; i++) {
      const MerchantContractAddress = merchantsList[i].MerchantContractAddress

      try {
        const requiredNumberOfVotes = await instanceMainContract2.getRequiredNumberOfVotes()
        const number_votes = await instanceMainContract2.getMerchantContractNumberOfVotes(MerchantContractAddress, { from: process.env.REACT_APP_OWNER_ADDRESS })

        let requiredNumberOfVotes_int = parseInt(requiredNumberOfVotes, 16)
        let number_votes_int = parseInt(number_votes, 16)

        merchantsInfo.push({ MerchantContractAddress: MerchantContractAddress, numberOfVotes: number_votes_int })

        for (let i = 0; i < merchantsInfo.length; i++) {
          if (merchantsInfo[i].MerchantContractAddress) {
            if (merchantsInfo[i].numberOfVotes <= requiredNumberOfVotes_int) {
              document.getElementById(`${merchantsInfo[i].MerchantContractAddress}`).textContent = `${merchantsInfo[i].numberOfVotes}`
              document.getElementById(`${merchantsInfo[i].MerchantContractAddress}_tr`).setAttribute("style", "display:table-row")
            }
            else {
              document.getElementById(`${merchantsInfo[i].MerchantContractAddress}_id`).textContent = 0
              document.getElementById(`${merchantsInfo[i].MerchantContractAddress}`).textContent = `${merchantsInfo[i].numberOfVotes}`
            }
          }
        }
      } catch (error) {
        console.log("ERROR AT GETTING MERCHANT CONTRACT INFO: ", error)
      }
    }
  }, [merchantsInfo, merchantsList])

  function saveNumberOfVotes(MerchantContractAddress) {
    let numberOfVotes

    for (let i = 0; i < merchantsInfo.length; i++) {
      if (merchantsInfo[i].MerchantContractAddress === MerchantContractAddress) {
        numberOfVotes = merchantsInfo[i].numberOfVotes
      }
    }

    localStorage.setItem("MerchantContractData", JSON.stringify({ MerchantContractAddress, numberOfVotes }))
    navigate(`/vote/merchant/${MerchantContractAddress}`)
  }


  useEffect(() => {
    document.getElementById("Buyer").setAttribute("style", "font-weight: normal; color: white !important;")
    document.getElementById("Merchant").setAttribute("style", "font-weight: normal; color: white !important;")
    document.getElementById("Admin").setAttribute("style", "font-weight: normal; color: white !important;")
    document.getElementById("Vote").setAttribute("style", "font-weight: bold; color: yellow !important;")
  }, [])

  useEffect(() => {
    getMerchantsList()
  }, [])

  useEffect(() => {
    getMerchantContractInfo()
  }, [getMerchantContractInfo])


  return (
    <>
      <h1>Vote</h1>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Merchant Address</th>
            <th>Merchant Name</th>
            <th>No. of Votes</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {merchantsList.map((item, i) => {
            return (
              <tr className="item" key={i} id={`${item.MerchantContractAddress}_tr`} style={{ display: "none", backgroundColor: "red" }}>
                <td className="itemDisplay"><span id={`${item.MerchantContractAddress}_id`}>{i + 1}</span></td>
                <td className="itemDisplay">{item.MerchantContractAddress}</td>
                <td className="itemDisplay">{item.MerchantName}</td>
                <td className="itemDisplay"><span id={item.MerchantContractAddress}></span></td>
                <td className="removeItemButton">
                  <button onClick={() => saveNumberOfVotes(item.MerchantContractAddress)}>+Info</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

export default Vote

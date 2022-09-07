import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from "react-router-dom"

import { ethers } from "ethers"
import MainContractABI from "../../abis/MainContract.json"
import { MAINCONTRACTADDRESS } from '../../constants'
const axios = require("axios")

const Vote = () => {
  const navigate = useNavigate()
  const [merchantsList, setMerchantsList] = useState([])
  // const [numberOfVotes, setNumberOfVotes] = useState(0)
  const merchantsInfo = useState([])

  // let merchantsInfo = []

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner(process.env.REACT_APP_OWNER_ADDRESS)
  // const instanceMainContract = new ethers.Contract(MAINCONTRACTADDRESS, MainContractABI.abi, signer)
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
      // console.log("MerchantsList: ", MerchantsList)

      setMerchantsList(MerchantsList)
    } catch (error) {
      console.log(error)
    }
  }

  /* async function getMerchantContractInfo() {
    for(let i = 0; i < merchantsList.length; i++) {
      // console.log(merchantsList[i])
      // console.log(merchantsList[i].MerchantContractAddress)

      const MerchantContractAddress = merchantsList[i].MerchantContractAddress

      try {
          // const number_votes = await instanceMainContract.merchants[MerchantContractAddress].votes
          const number_votes = await instanceMainContract.getMerchantContractNumberOfVotes(MerchantContractAddress, { from: process.env.OWNER_ADDRESS })

          // console.log("Number Of Votes: ", parseInt(number_votes, 16))
          
          // setNumberOfVotes(number_votes)

          merchantsInfo.push({MerchantContractAddress: MerchantContractAddress, numberOfVotes: parseInt(number_votes, 16)})

          console.log("merchantsInfo: ", merchantsInfo)
      } catch (error) {
          console.log("ERROR AT GETTING MERCHANT CONTRACT INFO: ", error)
      }
    }
    // getNumberVotes("0x16a2c5cc54519a9db7526c8a8681e20cb89fafc1")
  } */

  const getMerchantContractInfo = useCallback(async () => {
    const instanceMainContract2 = instanceMainContract.current
    // const merchantsInfo2 = merchantsInfo.current

    for (let i = 0; i < merchantsList.length; i++) {
      // console.log(merchantsList[i])
      // console.log(merchantsList[i].MerchantContractAddress)

      const MerchantContractAddress = merchantsList[i].MerchantContractAddress

      try {
        // const number_votes = await instanceMainContract2.merchants[MerchantContractAddress].votes
        const number_votes = await instanceMainContract2.getMerchantContractNumberOfVotes(MerchantContractAddress, { from: process.env.REACT_APP_OWNER_ADDRESS })
        let number_votes_int = parseInt(number_votes, 16)

        merchantsInfo.push({ MerchantContractAddress: MerchantContractAddress, numberOfVotes: number_votes_int })

        // console.log("merchantsInfo: ", merchantsInfo)

        for (let i = 0; i < merchantsInfo.length; i++) {
          if (merchantsInfo[i].MerchantContractAddress) {
            if (merchantsInfo[i].numberOfVotes < 3) {
              // console.log("NumberOfVotes: ", merchantsInfo[i].numberOfVotes)
              document.getElementById(`${merchantsInfo[i].MerchantContractAddress}`).textContent = `${merchantsInfo[i].numberOfVotes}`
              document.getElementById(`${merchantsInfo[i].MerchantContractAddress}_id`).textContent = i - 2
            }
            else {
              document.getElementById(`${merchantsInfo[i].MerchantContractAddress}`).textContent = `${merchantsInfo[i].numberOfVotes}`
              document.getElementById(`${merchantsInfo[i].MerchantContractAddress}_tr`).setAttribute("style", "background-color:red;display:none")
            }
          }
        }
      } catch (error) {
        console.log("ERROR AT GETTING MERCHANT CONTRACT INFO: ", error)
      }
    }
    /* getNumberVotes("0x16a2c5cc54519a9db7526c8a8681e20cb89fafc1")
    getNumberVotes() */
  }, [merchantsInfo, merchantsList])

  /* function getNumberVotes(MerchantContractAddress) {
    console.log("aqui")
    console.log("y: ", merchantsInfo.length)
    for (let i = 0; i < merchantsInfo.length; i++) {
      // console.log("aqui2")
      if (merchantsInfo[i].MerchantContractAddress === MerchantContractAddress) {
        // console.log("aqui3")
        console.log("NumberOfVotes: ", merchantsInfo[i].numberOfVotes)
        return merchantsInfo[i].numberOfVotes
      }
      else {
        // console.log("aqui4")
        return 0
      }
    }
  }

  function getNumberVotes() {
    // console.log("aqui")
    // console.log("y: ", merchantsInfo.length)
    for (let i = 0; i < merchantsInfo.length; i++) {
      // console.log("aqui2")
      if (merchantsInfo[i].MerchantContractAddress) {
        // console.log("aqui3")
        console.log("NumberOfVotes: ", merchantsInfo[i].numberOfVotes)
        document.getElementById(`${merchantsInfo[i].MerchantContractAddress}`).textContent=`${merchantsInfo[i].numberOfVotes}`
        // return merchantsInfo[i].numberOfVotes
      }
      // else {
      //   // console.log("aqui4")
      //   return 0
      // }
    }
  } */


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
    getMerchantsList()
  }, [])

  useEffect(() => {
    getMerchantContractInfo()
  }, [getMerchantContractInfo])

  useEffect(() => {
    document.getElementById("Buyer").setAttribute("style", "font-weight: normal; color: white !important;")
    document.getElementById("Merchant").setAttribute("style", "font-weight: normal; color: white !important;")
    document.getElementById("Admin").setAttribute("style", "font-weight: normal; color: white !important;")
    document.getElementById("Vote").setAttribute("style", "font-weight: bold; color: yellow !important;")
  }, [])

  /* const merchantsList = [
    { id: 0, merchantAddress: "1234", merchantName: "zxc", numberOfVotes: 50 },
    { id: 1, merchantAddress: "1234", merchantName: "zxc", numberOfVotes: 50 },
    { id: 2, merchantAddress: "1234", merchantName: "zxc", numberOfVotes: 500 },
    { id: 3, merchantAddress: "1234", merchantName: "zxc", numberOfVotes: 200 },
    { id: 4, merchantAddress: "1234", merchantName: "zxc", numberOfVotes: 1500 },
  ]

  getMerchantContractInfo()

  getNumberVotes("0x16a2c5cc54519a9db7526c8a8681e20cb89fafc1") */

  return (
    <>
      <h1>Vote</h1>

      <table className="table">
        <tr>
          <th>ID</th>
          <th>Merchant Address</th>
          <th>Merchant Name</th>
          <th>No. of Votes</th>
          <th></th>
        </tr>

        {merchantsList.map((item, i) => {
          return (
            <tr className="item" id={`${item.MerchantContractAddress}_tr`}>
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
      </table>
    </>
  )
}

export default Vote

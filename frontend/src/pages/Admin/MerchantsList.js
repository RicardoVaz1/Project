import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from "react-router-dom"

import { ethers } from "ethers"
import MainContractABI from "../../abis/MainContract.json"
import { MAINCONTRACTADDRESS } from '../../constants'
const axios = require("axios")


const MerchantsList = () => {
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
                        createMerchantContracts(orderBy: merchantName, orderDirection: asc) {
                            id
                            contractInstance
                            merchantAddress
                            merchantName
                        }
                    }
                    `
                }
            )

            let MerchantsList = result.data.data.createMerchantContracts
            setMerchantsList(MerchantsList)
        } catch (error) {
            console.log(error)
        }
    }

    const getMerchantContractInfo = useCallback(async () => {
        const instanceMainContract2 = instanceMainContract.current

        for (let i = 0; i < merchantsList.length; i++) {
            const MerchantContractAddress = merchantsList[i].contractInstance

            try {
                const number_votes = await instanceMainContract2.getNumberOfVotes(MerchantContractAddress, { from: process.env.REACT_APP_OWNER_ADDRESS })
                const status_contract = await instanceMainContract2.getStatusContract(MerchantContractAddress, { from: process.env.REACT_APP_OWNER_ADDRESS })

                let number_votes_int = parseInt(number_votes, 16)
                let status_contract_int = parseInt(status_contract, 16)

                merchantsInfo.push({ MerchantContractAddress: MerchantContractAddress, numberOfVotes: number_votes_int, statusContract: status_contract_int })

                for (let i = 0; i < merchantsInfo.length; i++) {
                    if (merchantsInfo[i].MerchantContractAddress) {
                        document.getElementById(`${merchantsInfo[i].MerchantContractAddress}_votes`).textContent = `${merchantsInfo[i].numberOfVotes}`

                        if (merchantsInfo[i].statusContract === 2) {
                            document.getElementById(`${merchantsInfo[i].MerchantContractAddress}_approved`).textContent = "Approved/Unpaused"
                            document.getElementById(`${merchantsInfo[i].MerchantContractAddress}_approvedButton`).setAttribute("style", "display: table-cell;")
                        }
                        else if (merchantsInfo[i].statusContract === 3) {
                            document.getElementById(`${merchantsInfo[i].MerchantContractAddress}_approved`).textContent = "Paused"
                            document.getElementById(`${merchantsInfo[i].MerchantContractAddress}_approvedButton`).setAttribute("style", "display: table-cell;")
                        }
                        else {
                            document.getElementById(`${merchantsInfo[i].MerchantContractAddress}_approved`).textContent = "Not Approved"
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
        let statusContract

        for (let i = 0; i < merchantsInfo.length; i++) {
            if (merchantsInfo[i].MerchantContractAddress === MerchantContractAddress) {
                numberOfVotes = merchantsInfo[i].numberOfVotes
                statusContract = merchantsInfo[i].statusContract
            }
        }

        statusContract === 2 ? statusContract = "Approved/Unpaused" : statusContract = "Paused"

        localStorage.setItem("MerchantContractData", JSON.stringify({ MerchantContractAddress, numberOfVotes, statusContract }))
        navigate(`/admin/edit/merchant/${MerchantContractAddress}`)
    }


    useEffect(() => {
        getMerchantsList()
    }, [])

    useEffect(() => {
        getMerchantContractInfo()
    }, [getMerchantContractInfo])


    return (
        <>
            <h1>Merchants List</h1>

            <table className="table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Merchant Contract Address</th>
                        <th>Merchant Name</th>
                        <th>No. of Votes</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {merchantsList.map((item, i) => {
                        return (
                            <tr className="item" key={item.contractInstance}>
                                <td className="itemDisplay">{i + 1}</td>
                                <td className="itemDisplay">{item.contractInstance}</td>
                                <td className="itemDisplay">{item.merchantName}</td>
                                <td className="itemDisplay"><span id={`${item.contractInstance}_votes`}></span></td>
                                <td className="itemDisplay"><span id={`${item.contractInstance}_approved`}></span></td>
                                <td className="removeItemButton" id={`${item.contractInstance}_approvedButton`} style={{ display: "none" }}>
                                    <button onClick={() => saveNumberOfVotes(item.contractInstance)}>Edit</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    )
}

export default MerchantsList

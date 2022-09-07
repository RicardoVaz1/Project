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
    
    // const { currentAccount } = JSON.parse(localStorage.getItem("userData"))

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

    const getMerchantContractInfo = useCallback(async () => {
        const instanceMainContract2 = instanceMainContract.current

        for (let i = 0; i < merchantsList.length; i++) {

            const MerchantContractAddress = merchantsList[i].MerchantContractAddress

            try {
                // const number_votes = await instanceMainContract2.merchants[MerchantContractAddress].votes
                const number_votes = await instanceMainContract2.getMerchantContractNumberOfVotes(MerchantContractAddress, { from: process.env.REACT_APP_OWNER_ADDRESS })
                const status_contract = await instanceMainContract2.getMerchantContractStatusContract(MerchantContractAddress, { from: process.env.REACT_APP_OWNER_ADDRESS })
                const status_withdrawals = await instanceMainContract2.getMerchantContractStatusWithdrawals(MerchantContractAddress, { from: process.env.REACT_APP_OWNER_ADDRESS })

                let number_votes_int = parseInt(number_votes, 16)
                let status_contract_int = parseInt(status_contract, 16)
                let status_withdrawals_int = parseInt(status_withdrawals, 16)

                // console.log("Number Of Votes: ", number_votes_int)
                // console.log("Status Contract: ", status_contract_int)
                // console.log("Status Withdrawals: ", status_withdrawals_int)

                merchantsInfo.push({ MerchantContractAddress: MerchantContractAddress, numberOfVotes: number_votes_int, statusContract: status_contract_int, statusWithdrawals: status_withdrawals_int })

                // console.log("merchantsInfo: ", merchantsInfo)

                for (let i = 0; i < merchantsInfo.length; i++) {
                    if (merchantsInfo[i].MerchantContractAddress) {
                        document.getElementById(`${merchantsInfo[i].MerchantContractAddress}_votes`).textContent = `${merchantsInfo[i].numberOfVotes}`

                        if (merchantsInfo[i].statusContract === 2) {
                            document.getElementById(`${merchantsInfo[i].MerchantContractAddress}_approved`).textContent = "Approved"
                            document.getElementById(`${merchantsInfo[i].MerchantContractAddress}_approvedButton`).setAttribute("style", "display: table-cell;")
                        }
                        else {
                            document.getElementById(`${merchantsInfo[i].MerchantContractAddress}_approved`).textContent = "Disapproved"
                        }

                        if (merchantsInfo[i].statusWithdrawals === 0) {
                            document.getElementById(`${merchantsInfo[i].MerchantContractAddress}_withdrawls`).textContent = "Unpaused"
                        }
                        else {
                            document.getElementById(`${merchantsInfo[i].MerchantContractAddress}_withdrawls`).textContent = "Paused"
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
        let statusWithdrawals

        for (let i = 0; i < merchantsInfo.length; i++) {
            if (merchantsInfo[i].MerchantContractAddress === MerchantContractAddress) {
                numberOfVotes = merchantsInfo[i].numberOfVotes
                statusContract = merchantsInfo[i].statusContract
                statusWithdrawals = merchantsInfo[i].statusWithdrawals
            }
        }

        statusContract === 2 ? statusContract = "Approved" : statusContract = "Disapproved"
        statusWithdrawals === 0 ? statusWithdrawals = "Unpaused" : statusWithdrawals = "Paused"

        localStorage.setItem("MerchantContractData", JSON.stringify({ MerchantContractAddress, numberOfVotes, statusContract, statusWithdrawals }))
        navigate(`/admin/edit/merchant/${MerchantContractAddress}`)
    }

    useEffect(() => {
        getMerchantsList()
    }, [])

    useEffect(() => {
        getMerchantContractInfo()
    }, [getMerchantContractInfo])

    /* const merchantsList = [
        { id: 0, MerchantContractAddress: "1234", MerchantName: "zxc", numberOfVotes: 0, approved: false, pausedWithdrawls: true },
        { id: 1, MerchantContractAddress: "1234", MerchantName: "zxc", numberOfVotes: 50, approved: false, pausedWithdrawls: true },
        { id: 2, MerchantContractAddress: "1234", MerchantName: "zxc", numberOfVotes: 500, approved: false, pausedWithdrawls: true },
        { id: 3, MerchantContractAddress: "1234", MerchantName: "zxc", numberOfVotes: 1200, approved: false, pausedWithdrawls: false },
        { id: 4, MerchantContractAddress: "1234", MerchantName: "zxc", numberOfVotes: 1500, approved: true, pausedWithdrawls: false },
    ] */

    return (
        <>
            <h1>Merchants List</h1>

            <table className="table">
                <tr>
                    <th>ID</th>
                    <th>Merchant Contract Address</th>
                    <th>Merchant Name</th>
                    <th>No. of Votes</th>
                    <th>Approved</th>
                    <th>Withdrawls</th>
                    <th></th>
                </tr>

                {merchantsList.map((item, i) => {
                    return (
                        <tr className="item" key={item.MerchantContractAddress}>
                            <td className="itemDisplay">{i + 1}</td>
                            <td className="itemDisplay">{item.MerchantContractAddress}</td>
                            <td className="itemDisplay">{item.MerchantName}</td>
                            <td className="itemDisplay"><span id={`${item.MerchantContractAddress}_votes`}></span></td>
                            <td className="itemDisplay"><span id={`${item.MerchantContractAddress}_approved`}></span></td>
                            <td className="itemDisplay"><span id={`${item.MerchantContractAddress}_withdrawls`}></span></td>
                            <td className="removeItemButton" id={`${item.MerchantContractAddress}_approvedButton`} /*style={{ display: "none" }}*/>
                                <button onClick={() => saveNumberOfVotes(item.MerchantContractAddress)}>Edit</button>
                            </td>
                        </tr>
                    )
                })}
            </table>
        </>
    )
}

export default MerchantsList

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
                const status_contract = await instanceMainContract2.getMerchantContractStatusContract(MerchantContractAddress, { from: process.env.REACT_APP_OWNER_ADDRESS })
                let status_contract_int = parseInt(status_contract, 16)
                // console.log("Status Contract: ", status_contract_int)

                merchantsInfo.push({ MerchantContractAddress: MerchantContractAddress, statusContract: status_contract_int })

                // console.log("merchantsInfo: ", merchantsInfo)

                for (let i = 0; i < merchantsInfo.length; i++) {
                    if (merchantsInfo[i].MerchantContractAddress) {
                        if (merchantsInfo[i].statusContract !== 2) {
                            document.getElementById(`${merchantsInfo[i].MerchantContractAddress}_status`).setAttribute("style", "display: none;")
                        }
                    }
                }
            } catch (error) {
                console.log("ERROR AT GETTING MERCHANT CONTRACT INFO: ", error)
            }
        }
    }, [merchantsInfo, merchantsList])


    useEffect(() => {
        document.getElementById("Buyer").setAttribute("style", "font-weight: bold; color: yellow !important;")
        document.getElementById("Merchant").setAttribute("style", "font-weight: normal; color: white !important;")
        document.getElementById("Admin").setAttribute("style", "font-weight: normal; color: white !important;")
        document.getElementById("Vote").setAttribute("style", "font-weight: normal; color: white !important;")
    }, [])
    
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
                <tr>
                    <th>ID</th>
                    <th>Merchant Contract Address</th>
                    <th>Merchant Name</th>
                    <th></th>
                </tr>

                {merchantsList.map((item, i) => {
                    return (
                        <tr className="item" id={`${item.MerchantContractAddress}_status`}>
                            <td className="itemDisplay">{i + 1}</td>
                            <td className="itemDisplay">{item.MerchantContractAddress}</td>
                            <td className="itemDisplay">{item.MerchantName}</td>
                            <td className="removeItemButton">
                                {item.approved === false ? "" :
                                    (<button onClick={() => navigate(`/merchant/${item.MerchantContractAddress}/products-list`)}>Check Products</button>)
                                }
                            </td>
                        </tr>
                    )
                })}
            </table>
        </>
    )
}

export default MerchantsList

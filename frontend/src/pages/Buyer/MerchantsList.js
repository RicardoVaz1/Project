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
                const status_contract = await instanceMainContract2.getStatusContract(MerchantContractAddress, { from: process.env.REACT_APP_OWNER_ADDRESS })
                let status_contract_int = parseInt(status_contract, 16)

                merchantsInfo.push({ MerchantContractAddress: MerchantContractAddress, statusContract: status_contract_int })

                for (let i = 0; i < merchantsInfo.length; i++) {
                    if (merchantsInfo[i].MerchantContractAddress) {
                        if (merchantsInfo[i].statusContract === 2) {
                            document.getElementById(`${merchantsInfo[i].MerchantContractAddress}_status`).setAttribute("style", "display: table-row;")
                        }
                        else {
                            document.getElementById(`${merchantsInfo[i].MerchantContractAddress}_id`).textContent = 0
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
                <thead>
                    <tr>
                        <th>Merchant Contract Address</th>
                        <th>Merchant Name</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {merchantsList.map((item, i) => {
                        return (
                            <tr className="item" key={i} id={`${item.contractInstance}_status`} style={{ display: "none", backgroundColor: "red" }}>
                                <td className="itemDisplay">{item.contractInstance}</td>
                                <td className="itemDisplay">{item.merchantName}</td>
                                <td className="removeItemButton">
                                    {item.approved === false ? "" :
                                        (<button onClick={() => navigate(`/merchant/${item.contractInstance}/products-list`)}>Check Products</button>)
                                    }
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

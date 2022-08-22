import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
const axios = require("axios")

const MerchantsList = () => {
    const navigate = useNavigate()
    const [merchantsList, setMerchantsList] = useState([])

    async function getMerchantsList() {
        try {
            const result = await axios.post(
                `${process.env.REACT_APP_THE_GRAPH_API}`,
                {
                    query: `
                    {
                        createMerchantContracts {
                            id
                            MerchantContractAddress
                            MerchantAddress
                            MerchantName
                        }
                    }
                    `
                }
            )

            let MerchantsList = result.data.data.createMerchantContracts
            // console.log("MerchantsList: ", MerchantsList)

            setMerchantsList(MerchantsList)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getMerchantsList()
    }, [])

    // const merchantsList = [
    //     { id: 0, MerchantContractAddress: "1234", MerchantName: "zxc", numberOfVotes: 0, approved: false, pausedWithdrawls: true },
    //     { id: 1, MerchantContractAddress: "1234", MerchantName: "zxc", numberOfVotes: 50, approved: false, pausedWithdrawls: true },
    //     { id: 2, MerchantContractAddress: "1234", MerchantName: "zxc", numberOfVotes: 500, approved: false, pausedWithdrawls: true },
    //     { id: 3, MerchantContractAddress: "1234", MerchantName: "zxc", numberOfVotes: 1200, approved: false, pausedWithdrawls: false },
    //     { id: 4, MerchantContractAddress: "1234", MerchantName: "zxc", numberOfVotes: 1500, approved: true, pausedWithdrawls: false },
    // ]

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
                            <td className="itemDisplay">{item.numberOfVotes}</td>
                            <td className="itemDisplay">{item.approved === true ? "Approved" : "Disapproved"}</td>
                            <td className="itemDisplay">{item.pausedWithdrawls === true ? "Paused" : "Unpaused"}</td>
                            <td className="removeItemButton">
                                {/* {item.approved === true ?  */}
                                    (<button onClick={() => navigate(`/admin/edit/merchant/${item.MerchantContractAddress}`)}>Edit</button>) : ""
                                {/* } */}
                            </td>
                        </tr>
                    )
                })}
            </table>
        </>
    )
}

export default MerchantsList

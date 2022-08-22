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
                        <tr className="item" key={item.MerchantContractAddress}>
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

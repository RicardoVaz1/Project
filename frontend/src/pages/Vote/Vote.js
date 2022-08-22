import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
const axios = require("axios")

const Vote = () => {
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
  //   { id: 0, merchantAddress: "1234", merchantName: "zxc", numberOfVotes: 50 },
  //   { id: 1, merchantAddress: "1234", merchantName: "zxc", numberOfVotes: 50 },
  //   { id: 2, merchantAddress: "1234", merchantName: "zxc", numberOfVotes: 500 },
  //   { id: 3, merchantAddress: "1234", merchantName: "zxc", numberOfVotes: 200 },
  //   { id: 4, merchantAddress: "1234", merchantName: "zxc", numberOfVotes: 1500 },
  // ]

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
            <tr className="item" key={item.MerchantContractAddress}>
              <td className="itemDisplay">{i + 1}</td>
              <td className="itemDisplay">{item.MerchantContractAddress}</td>
              <td className="itemDisplay">{item.MerchantName}</td>
              <td className="itemDisplay">{item.numberOfVotes}</td>
              <td className="removeItemButton">
                <button onClick={() => navigate(`/vote/merchant/${item.MerchantContractAddress}`)}>+Info</button>
              </td>
            </tr>
          )
        })}
      </table>
    </>
  )
}

export default Vote

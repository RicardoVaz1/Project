import React from 'react'
import { useNavigate } from "react-router-dom";

const Vote = () => {
  const navigate = useNavigate();

  const merchantsList = [
    {id: 0, walletAddress: "1234", merchantName: "zxc", numberOfVotes: 50},
    {id: 1, walletAddress: "1234", merchantName: "zxc", numberOfVotes: 50},
    {id: 2, walletAddress: "1234", merchantName: "zxc", numberOfVotes: 500},
    {id: 3, walletAddress: "1234", merchantName: "zxc", numberOfVotes: 200},
    {id: 4, walletAddress: "1234", merchantName: "zxc", numberOfVotes: 1500},
  ]

  return (
    <div>
      <h1>Vote</h1>

      <table className="table">
        <tr>
          <th>ID</th>
          <th>Wallet Address</th>
          <th>Merchant Name</th>
          <th>No. of Votes</th>
          <th></th>
        </tr>

        {merchantsList.map((item) => {
          return (
            <tr className="item" key={item.id}>
              <td className="itemDisplay">{item.id}</td>
              <td className="itemDisplay">{item.walletAddress}</td>
              <td className="itemDisplay">{item.merchantName}</td>
              <td className="itemDisplay">{item.numberOfVotes}</td>
              <td className="removeItemButton">
                <button onClick={() => navigate(`/vote/merchant/${item.id}`)}>+Info</button>
              </td>
            </tr>
          );
        })}
      </table>
    </div>
  )
}

export default Vote

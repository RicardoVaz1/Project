import React from 'react'
import { useNavigate } from "react-router-dom";

const MerchantsList = () => {
    const navigate = useNavigate();

    const merchantsList = [
        { id: 0, walletAddress: "1234", merchantName: "zxc", created: false, numberOfVotes: 50, approved: false, pausedWithdrawls: true },
        { id: 1, walletAddress: "1234", merchantName: "zxc", created: true, numberOfVotes: 50, approved: false, pausedWithdrawls: true },
        { id: 2, walletAddress: "1234", merchantName: "zxc", created: true, numberOfVotes: 500, approved: false, pausedWithdrawls: true },
        { id: 3, walletAddress: "1234", merchantName: "zxc", created: true, numberOfVotes: 200, approved: false, pausedWithdrawls: true },
        { id: 4, walletAddress: "1234", merchantName: "zxc", created: true, numberOfVotes: 1500, approved: true, pausedWithdrawls: false },
    ]

    function addMerchant(ID) {
        // MainContract > addMerchantContract(walletAddress, name)
        console.log("Merchant Created: ", ID)
    }

    return (
        <div>
            <h1>Merchants List</h1>

            <table className="table">
                <tr>
                    <th>ID</th>
                    <th>Wallet Address</th>
                    <th>Merchant Name</th>
                    <th>Created</th>
                    <th>No. of Votes</th>
                    <th>Approved</th>
                    <th>Withdrawls</th>
                    <th></th>
                </tr>

                {merchantsList.map((item) => {
                    return (
                        <tr className="item" key={item.id}>
                            <td className="itemDisplay">{item.id}</td>
                            <td className="itemDisplay">{item.walletAddress}</td>
                            <td className="itemDisplay">{item.merchantName}</td>
                            <td className="itemDisplay">{item.created === false ? "Not Created" : "Created"}</td>

                            <td className="itemDisplay">{item.created === true ? item.numberOfVotes : "-"}</td>
                            <td className="itemDisplay">{item.created === true ? (item.approved === false ? "Disapproved" : "Approved") : "-"}</td>
                            <td className="itemDisplay">{item.created === true ? (item.pausedWithdrawls === false ? "Unpaused" : "Paused") : "-"}</td>
                            <td className="removeItemButton">
                                {
                                    item.created === true ?
                                        (item.approved === false ? "" : (<button onClick={() => navigate(`/admin-logged/edit/merchant/${item.id}`)}>Edit</button>)) :
                                        <button onClick={() => addMerchant(item.id)}>Create</button>
                                }
                            </td>
                        </tr>
                    );
                })}
            </table>
        </div>
    )
}

export default MerchantsList

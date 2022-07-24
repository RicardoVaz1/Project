import { useNavigate } from "react-router-dom"

const MerchantsList = () => {
    const navigate = useNavigate()

    const merchantsList = [
        { id: 0, merchantAddress: "1234", merchantName: "zxc", created: false, numberOfVotes: 50, approved: false, pausedWithdrawls: true },
        { id: 1, merchantAddress: "1234", merchantName: "zxc", created: true, numberOfVotes: 50, approved: false, pausedWithdrawls: true },
        { id: 2, merchantAddress: "1234", merchantName: "zxc", created: true, numberOfVotes: 500, approved: false, pausedWithdrawls: true },
        { id: 3, merchantAddress: "1234", merchantName: "zxc", created: true, numberOfVotes: 200, approved: false, pausedWithdrawls: true },
        { id: 4, merchantAddress: "1234", merchantName: "zxc", created: true, numberOfVotes: 1500, approved: true, pausedWithdrawls: false },
    ]

    return (
        <>
            <h1>Merchants List</h1>

            <table className="table">
                <tr>
                    <th>ID</th>
                    <th>Merchant Address</th>
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
                            <td className="itemDisplay">{item.merchantAddress}</td>
                            <td className="itemDisplay">{item.merchantName}</td>
                            <td className="itemDisplay">{item.created === false ? "Not Created" : "Created"}</td>
                            <td className="itemDisplay">{item.created === true ? item.numberOfVotes : "-"}</td>
                            <td className="itemDisplay">{item.created === true ? (item.approved === false ? "Disapproved" : "Approved") : "-"}</td>
                            <td className="itemDisplay">{item.created === true ? (item.pausedWithdrawls === false ? "Unpaused" : "Paused") : "-"}</td>
                            <td className="removeItemButton">
                                {item.approved === false ? "" :
                                    (<button onClick={() => navigate(`/admin-logged/edit/merchant/${item.id}`)}>Edit</button>)
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

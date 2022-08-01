import { useNavigate } from "react-router-dom"

const MerchantsList = () => {
    const navigate = useNavigate()

    const merchantsList = [
        { id: 0, merchantAddress: "1234", merchantName: "zxc" },
        { id: 1, merchantAddress: "1234", merchantName: "zxc" },
        { id: 2, merchantAddress: "1234", merchantName: "zxc" },
        { id: 3, merchantAddress: "1234", merchantName: "zxc" },
        { id: 4, merchantAddress: "1234", merchantName: "zxc" },
    ]

    return (
        <>
            <h1>Merchants List</h1>

            <table className="table">
                <tr>
                    <th>ID</th>
                    <th>Merchant Address</th>
                    <th>Merchant Name</th>
                    <th></th>
                </tr>

                {merchantsList.map((item) => {
                    return (
                        <tr className="item" key={item.id}>
                            <td className="itemDisplay">{item.id}</td>
                            <td className="itemDisplay">{item.merchantAddress}</td>
                            <td className="itemDisplay">{item.merchantName}</td>
                            <td className="removeItemButton">
                                {item.approved === false ? "" :
                                    (<button onClick={() => navigate(`/buyer/merchant/${item.id}/products-list`)}>Check Products</button>)
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

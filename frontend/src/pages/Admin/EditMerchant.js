import React from 'react'
import { useNavigate } from "react-router-dom";

const EditMerchant = () => {
    const navigate = useNavigate();

    const location = new URL(window.location.href).pathname;
    const locationArray = location.split("/");
    const MerchantID = locationArray[4];

    const merchantsList = [
        { id: 1, walletAddress: "1234", merchantName: "zxc", numberOfVotes: 50, approved: false, pausedWithdrawls: true },
        { id: 2, walletAddress: "1234", merchantName: "zxc", numberOfVotes: 500, approved: false, pausedWithdrawls: true },
        { id: 3, walletAddress: "1234", merchantName: "zxc", numberOfVotes: 200, approved: false, pausedWithdrawls: true },
        { id: 4, walletAddress: "1234", merchantName: "zxc", numberOfVotes: 1500, approved: true, pausedWithdrawls: false },
        { id: 5, walletAddress: "1234", merchantName: "zxc", numberOfVotes: 1500, approved: true, pausedWithdrawls: false },
    ]

    function disapprove(ID) {
        console.log("ID: ", ID)

        // MainContract > disapproveMerchantContract(ID)

        document.getElementById("done-successfully1").style.display = '';

        setTimeout(function () {
            navigate("/admin-logged")
        }, 5000);
    }

    function pauseWithdrawls(ID) {
        console.log("ID: ", ID)

        // MainContract > freezeWithdrawalsMerchantContract(ID)

        document.getElementById("done-successfully2").style.display = '';

        setTimeout(function () {
            navigate("/admin-logged")
        }, 5000);
    }

    function unpauseWithdrawls(ID) {
        console.log("ID: ", ID)

        // MainContract > unfreezeWithdrawalsMerchantContract(ID)

        document.getElementById("done-successfully3").style.display = '';

        setTimeout(function () {
            navigate("/admin-logged")
        }, 5000);
    }

    return (
        <div>
            <h1>Edit Merchant #{MerchantID}</h1>
            <div className="side-by-side-buttons">
                <button onClick={() => navigate("/admin-logged")}>Cancel</button>

                { // IF Merchant approved -> disapprove()
                    (merchantsList[MerchantID - 1].approved === true) ? <button onClick={() => disapprove(MerchantID)}>Disapprove</button> : ""
                }

                { // IF Merchant approved and unpausedWithdrawls -> pauseWithdrawls() 
                    (merchantsList[MerchantID - 1].approved === true) && (merchantsList[MerchantID - 1].pausedWithdrawls === false) ? <button onClick={() => pauseWithdrawls(MerchantID)}>PauseWithdrawls</button> :

                        // ElseIF Merchant approved and pausedWithdrawls -> unpauseWithdrawls()
                        (merchantsList[MerchantID - 1].approved === true) && (merchantsList[MerchantID - 1].pausedWithdrawls === true) ? <button onClick={() => unpauseWithdrawls(MerchantID)}>UnpauseWithdrawls</button> : ""
                }

                {/* {console.log(merchantsList[MerchantID - 1].id)} */}
                {console.log(merchantsList[MerchantID - 1].approved)}


            </div>
            <span id="done-successfully1" style={{ "display": "none" }}>Merchant Disapproved! <br /> Redirecting ...</span>
            <span id="done-successfully2" style={{ "display": "none" }}>Merchant Withdrawls Paused! <br /> Redirecting ...</span>
            <span id="done-successfully3" style={{ "display": "none" }}>Merchant Withdrawls Unpaused! <br /> Redirecting ...</span>
        </div>
    )
}

export default EditMerchant

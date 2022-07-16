import React from 'react'
import { useNavigate } from "react-router-dom";

const MerchantInfo = () => {
    const navigate = useNavigate();

    const location = new URL(window.location.href).pathname;
    const locationArray = location.split("/");
    const MerchantID = locationArray[3];

    function vote(ID) {
        console.log("ID: ", ID)

        document.getElementById("done-successfully").style.display = '';

        // MainContract > voteNewMerchantContractApproval(ID)

        setTimeout(function () {
            navigate("/vote")
        }, 5000);
    }

    return (
        <div>
            <h1>Merchant #{MerchantID}</h1>
            <div className="side-by-side-buttons">
                <button onClick={() => navigate("/vote")}>Cancel</button>
                <button onClick={() => vote(MerchantID)}>Vote</button>
            </div>
            <span id="done-successfully" style={{ "display": "none" }}>Thank you for your vote! <br/> Redirecting ...</span>
        </div>
    )
}

export default MerchantInfo

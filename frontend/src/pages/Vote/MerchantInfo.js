import React from 'react'
import { useNavigate } from "react-router-dom";

const MerchantInfo = () => {
    const navigate = useNavigate();

    const location = new URL(window.location.href).pathname;
    const locationArray = location.split("/");
    const MerchantID = locationArray[3];

    const merchantsList = [
        { id: 0, walletAddress: "1234", merchantName: "zxc", numberOfVotes: 50 },
        { id: 1, walletAddress: "1234", merchantName: "zxc", numberOfVotes: 50 },
        { id: 2, walletAddress: "1234", merchantName: "zxc", numberOfVotes: 500 },
        { id: 3, walletAddress: "1234", merchantName: "zxc", numberOfVotes: 200 },
        { id: 4, walletAddress: "1234", merchantName: "zxc", numberOfVotes: 1500 },
    ]

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

            <span>ID: {merchantsList[MerchantID].id}</span>
            <br />

            <span>Wallet Address: {merchantsList[MerchantID].walletAddress}</span>
            <br />

            <span>Merchant Name: {merchantsList[MerchantID].merchantName}</span>
            <br />

            <span>Number of Votes: {merchantsList[MerchantID].numberOfVotes}</span>
            <br />


            <div className="side-by-side-buttons">
                <button onClick={() => navigate("/vote")}>Cancel</button>
                <button onClick={() => vote(MerchantID)}>Vote</button>
            </div>
            <span id="done-successfully" style={{ "display": "none" }}>Thank you for your vote! <br /> Redirecting ...</span>
        </div>
    )
}

export default MerchantInfo

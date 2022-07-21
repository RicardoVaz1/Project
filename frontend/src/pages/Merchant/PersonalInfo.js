import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import Sidebar from '../../components/Sidebar';

const PersonalInfo = () => {
    const navigate = useNavigate();

    const [walletAddress, setWalletAddress] = useState("");
    const [name, setName] = useState("");
    const [escrowAmount, setEscrowAmount] = useState("");
    const [balance, setBalance] = useState("");


    useEffect(() => {
        // MerchantContract > checkMyAddress()
        setWalletAddress("123456789")

        // MerchantContract > checkMyName()
        setName("qwer")

        // MerchantContract > checkMyEscrowAmount()
        setEscrowAmount(1000000000000000000)

        // MerchantContract > checkMyBalance()
        setBalance(5000000000000000000)
    }, []);

    function changeAddress() {
        if (walletAddress === "") {
            alert("Fill the wallet address!")
            return;
        }

        console.log("Done!")
        console.log("Wallet Ãddress: ", walletAddress)

        document.getElementById("done-successfully").style.display = '';

        // MerchantContract > changeMyAddress(walletAddress)

        setTimeout(function () {
            navigate("/logged")
        }, 5000);
    }

    function changeName() {
        if (name === "") {
            alert("Fill the name!")
            return;
        }

        console.log("Done!")
        console.log("Name: ", name)

        document.getElementById("done-successfully").style.display = '';

        // MerchantContract > changeMyName(name)

        setTimeout(function () {
            navigate("/logged")
        }, 5000);
    }

    return (
        <div>
            <h1>Personal Info</h1>

            <Sidebar logged={"merchant"} />

            <label htmlFor="walletAddress">Address:</label>
            <input
                type="text"
                id="walletAddress"
                name="fname"
                placeholder="Insert your wallet address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
            />
            <button onClick={() => changeAddress()}>Change</button>
            <br />

            <label htmlFor="name">Name: </label>
            <input
                type="text"
                id="name"
                name="fname"
                placeholder="Insert your wallet address"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button onClick={() => changeName()}>Change</button>
            <br />

            <label htmlFor="escrowAmount">Escrow Amount: </label>
            <span>{escrowAmount >= 10 ** 18 ? escrowAmount / 10 ** 18 + " ETH" : escrowAmount + " ETH"}</span>
            <br />

            <label htmlFor="balance">Balance: </label>
            <span>{balance >= 10 ** 18 ? balance / 10 ** 18 + " ETH" : balance + " ETH"}</span>
            <br />

            <br />
            <span id="done-successfully" style={{ "display": "none" }}>Done successfully! <br /> Redirecting ...</span>

        </div>
    )
}

export default PersonalInfo

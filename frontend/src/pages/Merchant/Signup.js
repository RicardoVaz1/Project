import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [walletAddress, setWalletAddress] = useState("");
  const [name, setName] = useState("");

  function submit() {
    if (walletAddress === "" || name === "") {
      alert("Fill all fields!")
      return;
    }

    console.log("Done!")
    console.log("Wallet Ãddress: ", walletAddress)
    console.log("Name: ", name)

    document.getElementById("done-successfully").style.display = '';

    // MainContract > addMerchantContract(walletAddress, name)

    setTimeout(function () {
      navigate("/vote")
    }, 5000);
  }

  return (
    <div>
      <h1>Signup</h1>

      <label htmlFor="walletAddress">Address:</label>
      <input
        type="text"
        id="walletAddress"
        name="fname"
        placeholder="Insert your wallet address"
        onChange={(e) => setWalletAddress(e.target.value)}
      />
      <br />

      <label htmlFor="merchantName">Name: </label>
      <input
        type="text"
        id="merchantName"
        name="lname"
        placeholder="Insert your name"
        onChange={(e) => setName(e.target.value)}
      />
      <br />

      <button onClick={() => submit()}>Submit</button>
      <br />

      <span id="done-successfully" style={{ "display": "none" }}>Done successfully! <br/> Redirecting ...</span>
    </div>
  )
}

export default Signup

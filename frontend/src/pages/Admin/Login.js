import React from 'react'
// import { useNavigate } from "react-router-dom";

import ConnectWallet from '../../components/ConnectWallet'

const Login = () => {
  // const navigate = useNavigate();

  return (
    <div>
      <h1>Login</h1>
      <ConnectWallet nextPage="/admin-logged"/>
      {/* <button onClick={() => navigate("/admin-logged")}>Login</button> */}
    </div>
  )
}

export default Login

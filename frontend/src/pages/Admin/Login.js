import ConnectWallet from '../../components/ConnectWallet'


const Login = () => {
  return (
    <>
      <h1>Login</h1>
      <ConnectWallet nextPage="/admin" />
    </>
  )
}

export default Login

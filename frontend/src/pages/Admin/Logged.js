import { useEffect } from 'react'
import AddMerchant from './AddMerchant'
import MerchantsList from './MerchantsList'
import SetupVotes from './SetupVotes'
import { MAINCONTRACTADDRESS } from '../../constants'


const Logged = () => {
    const { currentAccount, isAdmin, chainName } = JSON.parse(localStorage.getItem("userData"))


    useEffect(() => {
        document.getElementById("Merchant").setAttribute("style", "font-weight: normal; color: white !important;")
        document.getElementById("Admin").setAttribute("style", "font-weight: bold; color: yellow !important;")
    }, [])


    return (
        <>
            {isAdmin ?
                <h1>Welcome <a href={`https://${chainName}.etherscan.io/address/${MAINCONTRACTADDRESS}`} target="_blank" rel="noreferrer" >Admin</a>, {currentAccount.slice(0, 5)}...{currentAccount.slice(38)}!</h1> :
                <>
                    <h1>Welcome, {currentAccount.slice(0, 5)}...{currentAccount.slice(38)}!</h1>
                    <h4 style={{ color: "red", textDecoration: "underline" }}>This is not Admin!</h4>
                </>
            }

            <div id="page-wrap">
                <AddMerchant />
                <MerchantsList />
                <SetupVotes />
            </div>

            <br />
            <br />
        </>
    )
}

export default Logged

// import Sidebar from '../../components/Sidebar'
import AddMerchant from './AddMerchant'
import MerchantsList from './MerchantsList'

const Logged = () => {
    const { currentAccount } = JSON.parse(localStorage.getItem("userData"))

    return (
        <>
            <h1>Welcome Admin, {currentAccount.slice(0, 5)}...{currentAccount.slice(38)}!</h1>

            {/* <Sidebar logged={"admin"} /> */}

            <div id="page-wrap">
                <AddMerchant />
                <MerchantsList />
            </div>

            <br />
            <br />
        </>
    )
}

export default Logged

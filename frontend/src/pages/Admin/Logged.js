import { useSearchParams } from 'react-router-dom'

import Sidebar from '../../components/Sidebar'
import AddMerchant from './AddMerchant'
import MerchantsList from './MerchantsList'

const Logged = () => {
    const [searchparams] = useSearchParams()
    let CurrentAccount = searchparams.get("CurrentAccount")
    // let Balance = searchparams.get("Balance")

    return (
        <>
            <h1>Welcome Admin, {CurrentAccount.slice(0, 5)}...{CurrentAccount.slice(38)}!</h1>

            <Sidebar logged={"admin"} />

            <div id="page-wrap">
                <AddMerchant currentAccount={CurrentAccount} />
                <MerchantsList currentAccount={CurrentAccount} />
            </div>

            <br />
            <br />
        </>
    )
}

export default Logged

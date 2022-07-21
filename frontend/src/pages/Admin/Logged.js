import React from 'react'
import MerchantsList from './MerchantsList'
import Sidebar from '../../components/Sidebar';

const Logged = () => {
    return (
        <div>
            <h1>Admin Logged</h1>

            <Sidebar logged={"admin"} />

            <div id="page-wrap">
                <MerchantsList />
            </div>
        </div>
    )
}

export default Logged

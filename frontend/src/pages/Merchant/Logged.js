import React from 'react'
import PersonalInfo from './PersonalInfo'
import Sidebar from '../../components/Sidebar';

const Logged = () => {
    return (
        <div>
            <h1>Merchant Logged</h1>

            <Sidebar logged={"merchant"} />

            <div id="page-wrap">
                <PersonalInfo />
            </div>
        </div>
    )
}

export default Logged

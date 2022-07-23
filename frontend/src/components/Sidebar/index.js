import React from 'react'
import { slide as Menu } from 'react-burger-menu';

const Sidebar = ({ logged }) => {
    let items

    logged === "admin" ?
        (items = [
            { label: 'Merchants List', route: `${process.env.REACT_APP_PATH}/admin-logged` },
            { label: 'Add Merchant', route: `${process.env.REACT_APP_PATH}/admin-logged/add-merchant` }
        ]) :
        (items = [
            { label: 'Home', route: `${process.env.REACT_APP_PATH}/logged` },
            { label: 'Personal Info', route: `${process.env.REACT_APP_PATH}/personal-info` }
        ])

    return (
        <Menu>
            {items?.map((item) => {
                return (
                    <a className="menu-item" href={item.route}>
                        {item.label}
                    </a>
                );
            })}
        </Menu>
    )
}

export default Sidebar

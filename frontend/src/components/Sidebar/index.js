import { slide as Menu } from 'react-burger-menu'

const Sidebar = ({ logged }) => {
    let items

    logged === "admin" ?
        (items = [
            { label: 'Merchants List', route: "/admin" },
            { label: 'Add Merchant', route: "/admin/add-merchant" }
        ]) :
        (items = [
            { label: 'Home', route: "/dashboard" },
            { label: 'Personal Info', route: "/personal-info" }
        ])

    return (
        <Menu>
            {items?.map((item) => {
                return (
                    <a className="menu-item" href={item.route}>
                        {item.label}
                    </a>
                )
            })}
        </Menu>
    )
}

export default Sidebar

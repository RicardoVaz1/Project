import { NavLink } from "react-router-dom"

import classes from "./MainHeader.module.css"

const MainHeader = () => {
  return (
    <header className={classes.header}>
      <nav>
        <ul>
          <li>
            <NavLink activeClassName={classes.active} to="/buyer">
              Buyer
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName={classes.active} to="/login">
              Merchant
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName={classes.active} to="/admin">
              Admin
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName={classes.active} to="/vote">
              Vote
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default MainHeader

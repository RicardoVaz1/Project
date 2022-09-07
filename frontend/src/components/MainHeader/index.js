import { NavLink } from "react-router-dom"

import classes from "./MainHeader.module.css"

const MainHeader = () => {
  return (
    <header className={classes.header}>
      <nav>
        <ul>
          <li>
            <NavLink activeClassName={classes.active} to="/buyer" id="Buyer">
              Buyer
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName={classes.active} to="/login" id="Merchant">
              Merchant
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName={classes.active} to="/console" id="Admin">
              Admin
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName={classes.active} to="/vote" id="Vote">
              Vote
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default MainHeader

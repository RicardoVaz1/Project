import { NavLink } from "react-router-dom"
import classes from "./MainHeader.module.css"


const MainHeader = () => {
  return (
    <header className={classes.header}>
      <nav>
        <ul>
          <li>
            <NavLink to="/buyer" id="Buyer">
              Buyer
            </NavLink>
          </li>
          <li>
            <NavLink to="/login" id="Merchant">
              Merchant
            </NavLink>
          </li>
          <li>
            <NavLink to="/console" id="Admin">
              Admin
            </NavLink>
          </li>
          <li>
            <NavLink to="/vote" id="Vote">
              Vote
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default MainHeader

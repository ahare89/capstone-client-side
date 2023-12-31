import { Link, useNavigate } from "react-router-dom"
import "./NavBar.css"

export const NavBar = () => {
    const navigate = useNavigate()

    return (
        <div className="container-fluid">
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <ul className="navbar">
            <li className="navbar__item active">
                <Link className="navbar-brand mb-0 h2" to="/">Home</Link>
            </li>
            <li className="navbar__item active">
                <Link className="nav-link" to="/mybudgets">My Budgets</Link>
            </li>
            {
                localStorage.getItem("budget_user")
                    ? <li className="navbar__item navbar__logout">
                        <Link className="nav-link" to="" onClick={() => {
                            localStorage.removeItem("budget_user")
                            navigate("/", {replace: true})
                        }}>Logout</Link>
                    </li>
                    : ""
            }
        </ul>
        </nav>
        </div>
    )
}

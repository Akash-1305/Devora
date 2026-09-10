import { Link } from "react-router-dom";
import './HomeHeader.css'

export default function HomeHeader() {
    return (
        <div>
            <nav className="nav">
                <h2>
                    Devora
                </h2>
                <ul>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}
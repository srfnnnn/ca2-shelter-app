import { NavLink, useNavigate } from "react-router-dom";
// import logo from "../photos/card-image.png";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <header className="header">

      <nav className="navbar">
          <NavLink to="/" className="nav">
          Home
          </NavLink>

          <NavLink to="/listings" className="nav">
          Shelters
          </NavLink>

          {token ? (
          <button
            onClick={() => {
              handleLogout();
            }}
          >
            Logout
          </button>
        ) : (
          <NavLink to="/login" className="nav" >Login</NavLink>
        )}

        </nav>
    </header>
  );
}
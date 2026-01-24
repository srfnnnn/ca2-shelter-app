import { NavLink, Link } from "react-router-dom";
// import logo from "../photos/card-image.png";

export default function Navbar() {
  /* TODO: Complete the navbar 
    - add links to CardList and AddCard pages 
    - style as a navbar UI */

  return (
    <header className="header">

      {/* <Link to="/">
        <img
          className="logo"
          src={logo}
          alt="Card logo"
          title="Home"
        />
      </Link> */}

      <nav className="navbar">
          <NavLink to="/" className="nav">
          Home
          </NavLink>

          <NavLink to="/cards" className="nav">
          Cards
          </NavLink>

        </nav>
    </header>
  );
}
import React from "react";
import "./NavBar.css";
import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <div id='NavBar'>
            <div id="Search">
                <Link to="/" className="NavLink">Search</Link>
            </div>
            <div id="Saved-Books">
                <Link to="/savedbooks" className="NavLink SavedBooksLink">Saved Books</Link>
            </div>
        </div>
    );
}

export default NavBar;
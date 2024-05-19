import React from "react";
import "./NavBar.css";
import { Link } from 'react-router-dom'

const NavBar = () => {
    

    return (
        <div id='NavBar'>
            <div id="Search">
                <Link to="/" className="NavLink" id="Search">Search</Link>
            </div>
            <div className="NavLink" id="Book-Lists">
                Book Lists
            </div>
        </div>
    )
}

export default NavBar;
import React from 'react';
import './Header.css';
import logo from '../assets/logo.png';
import svglogo from '../assets/svglogo.svg';
import { FaGithub } from "react-icons/fa";

const Header = () => {
  return (
    <div className="header_main">
      <div className="logo">
        <img src={svglogo} alt="Logo" />
      </div>

      <div className="menu_items">
        <ul className='lists'>
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
          <li><FaGithub /></li>
        </ul>
      </div>
    </div>
  );
};

export default Header;

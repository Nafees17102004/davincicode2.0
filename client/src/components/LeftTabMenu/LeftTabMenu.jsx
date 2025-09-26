import React from 'react'
import {Link} from 'react-router-dom';
import './LeftTabMenu.css'

function LeftTabMenu() {
  return (
    <div className='left-tab-menu'>
      <ul className='menu-list'>
        <li className='menu-item'>
            <Link to="/" className='nav-link'>Language</Link>
        </li>
        <li className='menu-item'>
            <Link to="/project" className='nav-link'>Project</Link>
        </li>
      </ul>
    </div>
  )
}

export default LeftTabMenu

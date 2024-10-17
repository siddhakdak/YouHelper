import React from 'react'
import chrome from '../assets/chrome.png'
import './Extension.css'

const Extension = () => {
  return (
    <div className="outer">
        <div className="chromelogo">
            <img src={chrome} alt="Logo" />
        </div>
        <div className="text">
            <h4>Download Chrome <br /> Extension</h4>
        </div>
    </div>
  )
}

export default Extension;
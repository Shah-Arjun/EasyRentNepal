import React from 'react'

const Header = () => {
  return (
    <header>
        <div>
            {/* Container */}
            <div>
                {/* Logo */}
                <div>
                    <Link to="/">
                    <img src={asset} alt="" />
                    </Link>
                </div>
            </div>
        </div>
    </header>
  )
}

export default Header
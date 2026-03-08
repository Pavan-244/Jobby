import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {FiLogOut} from 'react-icons/fi'
import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <nav className="header-container">
      <div className="header-content">
        <Link to="/" className="website-logo-link">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
          <span className="website-name">Jobby</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="menu-list">
          <li>
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="nav-link">
              Jobs
            </Link>
          </li>
        </ul>

        <button type="button" className="logout-btn" onClick={onClickLogout}>
          Logout
        </button>

        {/* Mobile Menu */}
        <ul className="mobile-icons">
          <li>
            <Link to="/" className="icon-btn">
              <AiFillHome className="icon" />
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="icon-btn">
              <BsBriefcaseFill className="icon" />
            </Link>
          </li>
          <li>
            <button
              type="button"
              className="icon-btn"
              onClick={onClickLogout}
              data-testid="logout"
            >
              <FiLogOut className="icon" />
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default withRouter(Header)

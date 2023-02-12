import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import "../css/navbar.css"

const Navbar = () => {
  const { isAuth } = useSelector((state) => state.auth)

  return (
    <nav>
      <div className='container'>
        <div>
          <NavLink to='/'>
            <span>ASC</span>
          </NavLink>
        {/* </div> */}

        {isAuth ? (
          <>
            <NavLink to='/home' >
              <span>Home</span>
            </NavLink>

            <NavLink to='/course/running' >
              <span>RunningDept</span>
            </NavLink>

            <NavLink to='/home/registration' >
              <span>Register</span>
            </NavLink>

            <NavLink to='/logout'>
              <span>Logout</span>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to='/login'>
              <span>Login</span>
            </NavLink>

            <NavLink to='/set_pswd'>
              <span>Set Password</span>
            </NavLink>
          </>
        )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import "../css/navbar.css"

const Navbar = () => {
  const { isAuth } = useSelector((state) => state.auth)

  return (
    <nav className='navbar navbar-light bg-light'>
      <div className='container'>
        <div>
          <NavLink to='/'>
            <span className='navbar-brand mb-0 h1'>ASC</span>
          </NavLink>
        </div>

        {isAuth ? (
          <div>
            <NavLink to='/home' className='mx-3'>
              <span>Home</span>
            </NavLink>

            <NavLink to='/course/running' className='mx-3'>
              <span>RunningDept</span>
            </NavLink>

            <NavLink to='/home/registration' className='mx-3'>
              <span>Register</span>
            </NavLink>

            <NavLink to='/logout'>
              <span>Logout</span>
            </NavLink>
          </div>
        ) : (
          <div>
            <NavLink to='/login'>
              <span>Login</span>
            </NavLink>

            <NavLink to='/set_pswd' className='mx-3'>
              <span>Set Password</span>
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

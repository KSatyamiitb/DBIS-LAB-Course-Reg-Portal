import { useDispatch } from 'react-redux'
import { onLogout} from '../api/auth'
import Layout from '../components/layout'
import { Link } from 'react-router-dom'
import { unauthenticateUser } from '../redux/slices/authSlice'
import "../css/basic.css"

const Logout = () => {
  const dispatch = useDispatch()

  const logout = async () => {
    try {
      await onLogout()
      dispatch(unauthenticateUser())
      localStorage.removeItem('isAuth')
    } catch (error) {
      console.log(error.response)
    }
  }

  return (
    <div>
      <Layout>
        <h1>Logout ? </h1>
        <p style={{fontSize: '24px'}}>Are you sure you want to logout ?</p>        
        <Link to={'/home'}>
          <button style={{fontSize: '24px'}}> No </button>
        </Link>
        <space> </space>
        <button onClick={() => logout()} style={{fontSize: '24px'}}>
          Yes
        </button>
      </Layout>
    </div>
  )
}

export default Logout

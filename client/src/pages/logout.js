import { useDispatch } from 'react-redux'
import { onLogout} from '../api/auth'
import Layout from '../components/layout'
import { Link } from 'react-router-dom'
import { unauthenticateUser } from '../redux/slices/authSlice'

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
        <p>Are you sure you want to logout ?</p>        
        <Link to={'/home'}>
          <button className='btn btn-primary' > No </button>
        </Link>
        <space> </space>
        <button onClick={() => logout()} className='btn btn-primary'>
          Yes
        </button>
      </Layout>
    </div>
  )
}

export default Logout

import { useState } from 'react'
import { onLogin } from '../api/auth'
import Layout from '../components/layout'
import { useDispatch } from 'react-redux'
import { authenticateUser } from '../redux/slices/authSlice'
import "../css/basic.css"

const Login = () => {
  const [values, setValues] = useState({
    user_id: '',
    password: '',
  })
  const [error, setError] = useState(false)

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const dispatch = useDispatch()
  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      await onLogin(values)
      dispatch(authenticateUser())

      localStorage.setItem('isAuth', 'true')
    } catch (error) {
      console.log(error.response.data.errors[0].msg)
      setError(error.response.data.errors[0].msg)
    }
  }

  return (
    <Layout>
      <form onSubmit={(e) => onSubmit(e)} className='container mt-3'>
        <h1>Login</h1>

        <div className='mb-3'>
          <label htmlFor='user_id' className='form-label' style={{fontWeight:'bold',fontSize:'24px'}}>
            User_ID
          </label>
          <input
            onChange={(e) => onChange(e)}
            type='text'
            className='form-control'
            id='user_id'
            name='user_id'
            value={values.user_id}
            placeholder='00000'
            required
          />
        </div>

        <div className='mb-3'>
          <label htmlFor='password' className='form-label' style={{fontWeight:'bold',fontSize:'24px'}}>
            Password
          </label>
          <input
            onChange={(e) => onChange(e)}
            type='password'
            value={values.password}
            className='form-control'
            id='password'
            name='password'
            placeholder='password'
            required
          />
        </div>

        <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>

        <button type='submit' style={{fontSize:'24px',backgroundColor: '#2F3C7E'}}>
          Submit
        </button>
      </form>
    </Layout>
  )
}

export default Login

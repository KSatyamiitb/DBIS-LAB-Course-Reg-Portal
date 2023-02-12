import { useState } from 'react'
import { onSetPswd } from '../api/auth'
import Layout from '../components/layout'
import "../css/basic.css"

const SetPswd = () => {
  const [values, setValues] = useState({
    user_id: '',
    password: '',
  })
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      const { data } = await onSetPswd(values)

      setError('')
      setSuccess(data.message)
      setValues({ user_id: '', password: '' })
    } catch (error) {
      setError(error.response.data.errors[0].msg)
      setSuccess('')
    }
  }

  return (
    <Layout>
      <form onSubmit={(e) => onSubmit(e)} className='container mt-3'>
        <h1>Set Password</h1>

        <div className='mb-3'>
          <label htmlFor='user_id' className='form-label'>
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
          <label htmlFor='password' className='form-label'>
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
        <div style={{ color: 'green', margin: '10px 0' }}>{success}</div>

        <button type='submit' className='btn btn-primary'>
          Submit
        </button>
      </form>
    </Layout>
  )
}

export default SetPswd

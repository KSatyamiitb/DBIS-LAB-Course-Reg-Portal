import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchRunDeptInfo, onLogout} from '../api/auth'
import Layout from '../components/layout'
import { unauthenticateUser } from '../redux/slices/authSlice'
import "../css/basic.css"

const RunningDept = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [protectedData, setProtectedData] = useState(null)

  const logout = async () => {
    try {
      await onLogout()

      dispatch(unauthenticateUser())
      localStorage.removeItem('isAuth')
    } catch (error) {
      console.log(error.response)
    }
  }


  const protectedInfo = async () => {
    try {
      var data  = await fetchRunDeptInfo()
      setProtectedData(data)
      // console.log(data)

      setLoading(false)
    } catch (error) {
      logout()
    }
  }

  useEffect(() => {
    protectedInfo()
  }, [])

  return loading ? (
    <Layout>
      <h1>Loading...</h1>
    </Layout>
  ) : (
    <div>
      <Layout>
        <h1>Running Departments</h1>
        {protectedData.data.depts.map((dept) => (
            <li><a href={`/course/running/${dept.dept_name}`}>{dept.dept_name}</a></li>
        ))}
      </Layout>
    </div>
  )
}

export default RunningDept

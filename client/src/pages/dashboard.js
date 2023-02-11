import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchUserInfo, onLogout, ondrop} from '../api/auth'
import Layout from '../components/layout'
import { unauthenticateUser } from '../redux/slices/authSlice'

const Dashboard = () => {
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

  const drop = async (course) => {
    try {
      console.log(course)
      await ondrop(course)
    } catch (error) {
      console.log(error.response)
    }
  }


  const protectedInfo = async () => {
    try {
      console.log("2222222222")
      var data  = await fetchUserInfo()
      console.log(data)
      setProtectedData(data)

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
        <h1>Home</h1>
        <p>ID : {protectedData.data.id}
          <br></br>
          NAME : {protectedData.data.name}
          <br></br>
          DEPT : {protectedData.data.dept_name}
          <br></br>
          TOTAL CREDITS : {protectedData.data.tot_cred}
          <br></br>
          COURSES :
          <br></br>
          {protectedData.data.cur_courses.map((course) => (
            <li>{course.course_id}, {course.title}, {course.semester}, {course.year}, {course.sec_id}, {course.grade}   <> </>
              <button onClick={() => drop(course)} className='btn btn-primary'>
              drop
              </button>
            </li>
          ))}
          {protectedData.data.courses.map((course) => (
            <li>{course.course_id}, {course.title}, {course.semester}, {course.year}, {course.sec_id}, {course.grade}</li>
          ))}
        </p>
      </Layout>
    </div>
  )
}

export default Dashboard

import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchInstructorInfo, onLogout} from '../api/auth'
import Layout from '../components/layout'
import { unauthenticateUser } from '../redux/slices/authSlice'
import "../css/basic.css"

const Course = () => {
  const ins = useParams()
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
      var data  = await fetchInstructorInfo(ins.instructor_id)
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
        <h3>Instructor Details </h3>
        <table>
              <tbody>
                  <tr><td style={{ fontWeight: 'bold' }}>Professor Name</td><td>{protectedData.data.about.name}</td></tr>
                  <tr><td style={{ fontWeight: 'bold' }}>ID</td><td>{ins.instructor_id}</td></tr>
                  <tr><td style={{ fontWeight: 'bold' }}>Department</td><td>{protectedData.data.about.dept_name}</td></tr>
              </tbody>
            </table>
        <h3>Active Courses </h3>
        {protectedData.data.cur_courses.map((cur) => (
              <li><a href={`/course/${cur.course_id}`}>{cur.course_id}  {cur.title}</a></li>))}
        <h3>Past Courses </h3>
        {protectedData.data.past_courses.map((past) => (
              <li>{past.course_id}  {past.title}  {past.year}  {past.semester}</li>))}
      </Layout>
    </div>
  )
}

export default Course

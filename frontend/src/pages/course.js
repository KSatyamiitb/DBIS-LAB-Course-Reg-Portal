import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchCourseInfo, onLogout} from '../api/auth'
import Layout from '../components/layout'
import { unauthenticateUser } from '../redux/slices/authSlice'
import "../css/basic.css"

const Course = () => {
  const course = useParams()
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
      var data  = await fetchCourseInfo(course.course_id)
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
        <h3>Course details </h3>
        <table>
              <tbody>
                  <tr><td style={{ fontWeight: 'bold' }}>Course Title</td><td>{protectedData.data.about.title}</td></tr>
                  <tr><td style={{ fontWeight: 'bold' }}>ID</td><td>{course.course_id}</td></tr>
                  <tr><td style={{ fontWeight: 'bold' }}>Department</td><td>{protectedData.data.about.dept_name}</td></tr>
                  <tr><td style={{ fontWeight: 'bold' }}>Credits</td><td>{protectedData.data.about.credits}</td></tr>
              </tbody>
            </table>
        <h3>Prerequisites </h3>
        {protectedData.data.prereq.map((pre) => (
              <li><a href={`/course/${pre.prereq_id}`}>{pre.prereq_id}  {pre.title}</a></li>))}
        <h3>Instructors </h3>
        {protectedData.data.instructors.map((ins) => (
              <li><a href={`/instructor/${ins.id}`}>{ins.name} (ID: {ins.id})</a></li>))}
      </Layout>
    </div>
  )
}

export default Course

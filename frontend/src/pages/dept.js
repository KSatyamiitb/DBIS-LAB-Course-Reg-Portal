import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchRunDeptCourseInfo, onLogout} from '../api/auth'
import Layout from '../components/layout'
import { unauthenticateUser } from '../redux/slices/authSlice'
import "../css/basic.css"

const Dept = () => {
  const dept = useParams()
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
      var data  = await fetchRunDeptCourseInfo(dept.dept_name)
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
        <h1>Running Courses in {dept.dept_name} Dept.</h1>
        {protectedData.data.courses.map((course) => (
            <li><a href={`/course/${course.course_id}`}>{course.course_id}  {course.title}</a></li>
        ))}
      </Layout>
    </div>
  )
}

export default Dept

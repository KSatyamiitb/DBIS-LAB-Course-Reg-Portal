import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchInstructorInfo, onLogout} from '../api/auth'
import Layout from '../components/layout'
import { unauthenticateUser } from '../redux/slices/authSlice'
import "../css/basic.css"

const Course = () => {
  const ins = useParams()
//   console.log(ins.instructor_id)
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
      console.log(data)

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
        <h1>Prof. {protectedData.data.about.name}</h1>
        <h3>ID : {ins.instructor_id}</h3>
        <h3>Dept : {protectedData.data.about.dept_name} </h3>
        <h3>Active Courses :</h3>
        {protectedData.data.cur_courses.map((cur) => (
              <li><a href={`/course/${cur.course_id}`}>{cur.course_id}  {cur.title}</a></li>))}
        <h3>Past Courses :</h3>
        {protectedData.data.past_courses.map((past) => (
              <li>{past.course_id}  {past.title}  {past.year}  {past.semester}</li>))}
        {/* <p id="demo"></p>
        <script>
          let numberOuput1 = document.getElementById("demo");
          let a = 1;
          let isequal = protectedData.data.prereq.length == a;
          numberOuput1.innerHTML = isequal;
          {/* if ({protectedData.data.prereq.length == 0}) {
            console.log("reached 1")
            // document.getElementById("demo").innerHTML = " None "
          } else {
            console.log("reached 2")

          }
        </script> */}
      </Layout>
    </div>
  )
}

export default Course

import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchUserInfo, onLogout, ondrop} from '../api/auth'
import Layout from '../components/layout'
import { unauthenticateUser } from '../redux/slices/authSlice'
import "../css/table.css"
import "../css/basic.css"

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


  const protectedInfo = async () => {
    try {
      var data  = await fetchUserInfo()
      setProtectedData(data)
      setLoading(false)
    } catch (error) {
      logout()
    }
  }

  useEffect(() => {
    protectedInfo()
  }, [])

  function refreshPage() {
      window.location.reload(false);
  }

  const drop = async (course) => {
    try {
      // console.log(course)
      await ondrop(course)
    } catch (error) {
      console.log(error.response)
    }
  }

  return loading ? (
    <Layout>
      <h1>Loading...</h1>
    </Layout>
  ) : (
    <div>
      <Layout>
        <h3>Student Details</h3>
          <table>
              <tbody>
                  <tr><td style={{ fontWeight: 'bold' }}>ID</td><td>{protectedData.data.id}</td></tr>
                  <tr><td style={{ fontWeight: 'bold' }}>NAME</td><td>{protectedData.data.name}</td></tr>
                  <tr><td style={{ fontWeight: 'bold' }}>DEPT</td><td>{protectedData.data.dept_name}</td></tr>
                  <tr><td style={{ fontWeight: 'bold' }}>TOTAL CREDITS</td><td>{protectedData.data.tot_cred}</td></tr>
              </tbody>
            </table>
          <h4><b>Current Courses : Year:</b>{protectedData.data.cur_year}<b> Semester:</b>{protectedData.data.cur_sem}</h4><table>
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Section</th>
                  <th>Drop</th>
                </tr>
              </thead>
              <tbody>
                {protectedData.data.cur_courses.map((course) => (
                  <tr><td>{course.course_id}</td><td>{course.title}</td><td>{course.sec_id}</td><td><button onClick={() => {
                    drop(course)
                    refreshPage()}} >
                  Drop</button></td></tr>
                ))}
              </tbody>
              </table>
          {protectedData.data.courses.map((row)=>(
          <><h4><b>YEAR:</b>{row.year} <b>SEMESTER:</b>{row.semester}</h4><table>
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Section</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {row.rows.map((item) => (
                  <tr>
                  <td>{item.split(',')[1]}</td>
                  <td>{item.split(',')[2]}</td>
                  <td>{item.split(',')[3]}</td>
                  <td>{item.split(',')[4]}</td>
                </tr>
                ))}
              </tbody>
            </table></>
          ))}
      </Layout>
    </div>
  )
}

export default Dashboard

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

  function refreshPage() {
    window.location.reload();
}

  const drop = async (course) => {
    try {
      console.log(course)
      await ondrop(course)
      refreshPage()
    } catch (error) {
      console.log(error.response)
    }
  }


  const protectedInfo = async () => {
    try {
      var data  = await fetchUserInfo()
      console.log(data)
      // data.data.courses.map((sem)=>(
      //   sem.rows.map((item)=>console.log(item.split(',')))
      // ))
      console.log("111111")
      setProtectedData(data)
      console.log("2222222")

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
            <li>{course.course_id}, {course.semester}, {course.year}, {course.sec_id}, {course.grade}     <button onClick={() => drop(course)} className='btn btn-primary'>
            drop
          </button></li>
          ))}
          {protectedData.data.courses.map((row)=>(
          <><h2>YEAR:{row.year} SEMESTER:{row.semester}</h2><table>
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
        </p>

        <button onClick={() => logout()} className='btn btn-primary'>
          Logout
        </button>
      </Layout>
    </div>
  )
}

export default Dashboard

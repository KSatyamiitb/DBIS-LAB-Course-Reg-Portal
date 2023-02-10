import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  Outlet,
} from 'react-router-dom'
import Dashboard from './pages/dashboard'
import Register from './pages/register'
import ASC from './pages/asc'
import Login from './pages/login'
import SetPswd from './pages/setpswd'
import Dept from './pages/dept'
import Course from './pages/course'
import Instructor from './pages/instructor'
import RunningDept from './pages/runningdept'
import { useSelector } from 'react-redux'

const PrivateRoutes = () => {
  const { isAuth } = useSelector((state) => state.auth)

  return <>{isAuth ? <Outlet /> : <Navigate to='/login' />}</>
}

const RestrictedRoutes = () => {
  const { isAuth } = useSelector((state) => state.auth)

  return <>{!isAuth ? <Outlet /> : <Navigate to='/home' />}</>
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ASC />} />

        <Route element={<PrivateRoutes />}>
          <Route path='/home' element={<Dashboard />} />
          <Route path='/home/registration' element={<Register />} />
          <Route path='/course/running' element={<RunningDept />} />
          <Route path='/course/:course_id' element={<Course />} />
          <Route path='/course/running/:dept_name' element={<Dept />} />
          <Route path='/instructor/:instructor_id' element={<Instructor />} />
        </Route>

        <Route element={<RestrictedRoutes />}>
          <Route path='/set_pswd' element={<SetPswd />} />
          <Route path='/login' element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

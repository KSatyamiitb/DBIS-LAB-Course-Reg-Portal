import axios from 'axios'
axios.defaults.withCredentials = true

export async function onSetPswd(setPswdData) {
  return await axios.post('http://localhost:8000/set_pswd',setPswdData)
}

export async function onLogin(loginData) {
  return await axios.post('http://localhost:8000/login', loginData)
}

export async function ondrop(course) {
  return await axios.post('http://localhost:8000/home', course)
}

export async function onRegister(courseData) {
  return await axios.post('http://localhost:8000/home/register',courseData)
}

export async function onLogout() {
  return await axios.get('http://localhost:8000/logout')
}

export async function fetchUserInfo() {
  return await axios.get('http://localhost:8000/home')
}

export async function fetchRegistrationInfo() {
  return await axios.get('http://localhost:8000/home/register')
}

export async function fetchRunDeptInfo() {
  return await axios.get('http://localhost:8000/home/rundept')
}

export async function fetchRunDeptCourseInfo(dept_name) {
  return await axios.get(`http://localhost:8000/home/rundept/${dept_name}`, dept_name)
}

export async function fetchCourseInfo(course_id) {
  return await axios.get(`http://localhost:8000/home/${course_id}`, course_id)
}

export async function fetchInstructorInfo(id) {
  return await axios.get(`http://localhost:8000/home/instructor/${id}`, id)
}


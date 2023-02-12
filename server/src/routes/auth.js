const { Router } = require('express')
const {
  getUsers,
  login,
  protected,
  registration,
  runningdept,
  runningdeptcourses,
  getcourse,
  getinstructor,
  dropcourse,
  logout,
  set_pass,
  registerForCourse
} = require('../controllers/auth')
const {
  validationMiddleware,
} = require('../middlewares/validations-middleware')
const { pswdValidation, registerValidation, loginValidation } = require('../validators/auth')
const { auth, auth_login } = require('../middlewares/auth-middleware')
const router = Router()

router.get('/get-users', getUsers)
router.get('/home', auth, protected)
router.get('/home/register', auth, registration)
router.get('/home/rundept', auth, runningdept)
router.get('/home/rundept/:dept_name', auth, runningdeptcourses)
router.get('/home/:course_id', auth, getcourse)
router.get('/home/instructor/:instructor_id', auth, getinstructor)
router.post('/home', dropcourse)
router.post('/set_pswd', pswdValidation, validationMiddleware, set_pass)
router.post('/login', loginValidation, validationMiddleware, login)
router.get('/logout', logout)
router.post('/home/register', registerValidation, validationMiddleware, registerForCourse)//New

module.exports = router

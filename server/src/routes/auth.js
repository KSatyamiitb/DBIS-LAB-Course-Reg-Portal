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
} = require('../controllers/auth')
const {
  validationMiddleware,
} = require('../middlewares/validations-middleware')
const { registerValidation, loginValidation } = require('../validators/auth')
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
router.post('/set_pswd', registerValidation, validationMiddleware, set_pass)
router.post('/login', loginValidation, validationMiddleware, login)
router.get('/logout', logout)

module.exports = router

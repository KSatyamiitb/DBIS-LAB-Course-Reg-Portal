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
const { userAuth } = require('../middlewares/auth-middleware')
const router = Router()

router.get('/get-users', getUsers)
router.get('/home', userAuth, protected)
router.get('/home/register', userAuth, registration)
router.get('/home/rundept', userAuth, runningdept)
router.get('/home/rundept/:dept_name', userAuth, runningdeptcourses)
router.get('/home/:course_id', userAuth, getcourse)
router.get('/home/instructor/:instructor_id', userAuth, getinstructor)
router.post('/home', dropcourse)
router.post('/set_pswd', registerValidation, validationMiddleware, set_pass)
router.post('/login', loginValidation, validationMiddleware, login)
router.get('/logout', logout)

module.exports = router

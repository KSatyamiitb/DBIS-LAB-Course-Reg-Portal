const { Router } = require('express')
const {
  getUsers,
  login,
  protected,
  registration,
  runningdept,
  runningdeptcourses,
  dropcourse,
  logout,
  set_pass,
  registerForCourse//New
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
router.post('/home/rundeptcourse', userAuth, runningdeptcourses)
router.post('/home', dropcourse)
router.post('/set_pswd', registerValidation, validationMiddleware, set_pass)
router.post('/login', loginValidation, validationMiddleware, login)
router.get('/logout', logout)
router.post('/home/register', registerForCourse)//New

module.exports = router

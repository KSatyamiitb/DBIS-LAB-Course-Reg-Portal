const express = require('express')
const app = express()
const { PORT, CLIENT_URL, SECRET } = require('./constants')
const cors = require('cors')
const sessions = require('express-session')


//initialize middlewares
app.use(express.json())
app.use(cors({ origin: CLIENT_URL, credentials: true }))

const oneDay = 1000*60*60*24;
app.use(sessions({
    secret : SECRET,
    saveUninitialized: true,
    cookie : { maxAge: oneDay },
    resave: false
}));

//import routes
const authRoutes = require('./routes/auth')


//initialize routes
app.use('/', authRoutes)

//app start
const appStart = () => {
  try {
    app.listen(PORT, () => {
      console.log(`The app is running at http://localhost:${PORT}`)
    })
  } catch (error) {
    console.log(`Error: ${error.message}`)
  }
}

appStart()

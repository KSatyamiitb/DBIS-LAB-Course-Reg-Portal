const passport = require('passport')
const { Strategy } = require('passport-jwt')
const { SECRET } = require('../constants')
const db = require('../db')

const cookieExtractor = function (req) {
  let token = null
  if (req && req.cookies) token = req.cookies['token']
  return token
}

const opts = {
  secretOrKey: SECRET,
  jwtFromRequest: cookieExtractor,
}

passport.use(
  new Strategy(opts, async ({ id }, done) => {
    try {
      const { rows } = await db.query(
        'SELECT ID, name FROM student WHERE ID = $1',
        [id]
      )

      if (!rows.length) {
        throw new Error('401 not authorized')
      }
      // console.log("--------------------------------------------")
      // console.log(rows[0].id)
      let user = { id: rows[0].id, name: rows[0].name }

      return await done(null, user)
    } catch (error) {
      console.log(error.message)
      done(null, false)
    }
  })
)

const { check } = require('express-validator')
const db = require('../db')
const { compare } = require('bcryptjs')

//password
const password = check('password')
  .isLength({ min: 6, max: 15 })
  .withMessage('Password has to be between 6 and 15 characters.')

//check if user_id exists
const user_idExists = check('user_id').custom(async (value) => {

  var rows = await db.query('SELECT * from user_password WHERE id = $1', [
    value,
  ])

  if (rows.rowCount) {
    throw new Error('Password already set for given user_id.')
  }

  rows = await db.query('SELECT * from student WHERE ID = $1', [
    value,
  ])

  // // const { rows_i } = await db.query('SELECT * from instructor WHERE ID = $1', [
  // //   value,
  // // ])

  if (!rows.rowCount) {//&& !rows_i) {
    throw new Error('No such user exists.')
  }
})

//login validation
const loginFieldsCheck = check('user_id').custom(async (value, { req }) => {
  var rows = await db.query('SELECT * from student WHERE ID = $1', [
    value,
  ])
  // console.log(rows)

  // // const { rows_i } = await db.query('SELECT * from instructor WHERE ID = $1', [
  // //   value,
  // // ])

  if (!rows.rowCount) {//&& !rows_i) {
    throw new Error('No such user exists.')
  }
  // console.log(value)

  console.log("IN LOGIN VALIDATOR")
  var user = await db.query('SELECT * from user_password WHERE id = $1', [value])
  console.log(user.rows)

  if (!user.rowCount) {
    throw new Error('Password not set for given user_id.')
  }
  // console.log(req.body.password)
  // console.log(user.rows[0].hashed_password)
  
  const validPassword = await compare(req.body.password, user.rows[0].hashed_password)
  // console.log(validPassword)

  if (!validPassword) {
    throw new Error('Wrong password')
  }

  console.log("IN LOGIN VALIDATOR vvvv")
  req.user = user.rows[0]
  console.log("IN LOGIN VALIDATOR nnnn")
})

module.exports = {
  registerValidation: [password, user_idExists],
  loginValidation: [loginFieldsCheck],
}

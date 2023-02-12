const { check } = require('express-validator')
const db = require('../db')
const { compare } = require('bcryptjs')


const getCurrent = async () => {
  try{
    var result = await db.query('select * from section order by year desc,case when semester = \'Spring\' then 1 when semester = \'Summer\' then 2 when semester = \'Fall\' then 3 else 4 end desc limit 1')
    console.log(result)
    console.log("1111")
    console.log(result.rows)
    console.log(result.rows[0])
    console.log(result.rows[0].semester)
    console.log(result.rows[0].year)
    return result.rows[0]
  } catch (error) {
    console.log(error.message)
  }
}



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


// registration validation 
const registrationCheck = check('id').custom(async (value, { req }) => {
  console.log("REGISTERVALIDATION ENTERED")
  var { id, course_id, sec_id, title } = req.body
  const cur = await getCurrent()
  const cur_sem = cur.semester
  const cur_year = cur.year
  
  var prereq =await db.query('select prereq_id from prereq where prereq_id not in (select course_id from takes where ID=$1 and (year<$2 or (year=$2 and semester!=$3))) and course_id=$4',[id,cur_year,cur_sem,course_id])

  if (prereq.rowCount>=1) {
    throw new Error('Prerequisites not satisfied! Registration unsuccessful.')
  }

  var timeclash=await db.query('select course_id from section natural join takes where ID=$1 and semester = $4 and year = $5 and time_slot_id in (select time_slot_id from section where course_id=$2 and sec_id=$3 and semester=$4 and year=$5)',[id,course_id,sec_id,cur_sem,cur_year])
  console.log(timeclash.rows)
  if(timeclash.rowCount>=1){
    throw new Error('Time_slot clash! Registration unsuccessful.')
  }
})


module.exports = {
  pswdValidation: [password, user_idExists],
  loginValidation: [loginFieldsCheck],
  registerValidation: [registrationCheck],
}

const db = require('../db')
const { hash, genSalt } = require('bcryptjs')
const saltRounds = 10
const { sign } = require('jsonwebtoken')
const { SECRET } = require('../constants')

exports.getUsers = async (req, res) => {
  try {
    const { rows } = await db.query('select ID, name from student')

    return res.status(200).json({
      success: true,
      users: rows,
    })
  } catch (error) {
    console.log(error.message)
  }
}

exports.set_pass = async (req, res) => {
  const { user_id, password } = req.body
  try {
    const salt = await genSalt(saltRounds)
    const hashedPassword = await hash(password, salt)

    await db.query('insert into user_password(id,hashed_password) values ($1 , $2)', [
      user_id,
      hashedPassword,
    ])

    return res.status(201).json({
      success: true,
      message: 'Password set was successfull',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      error: error.message,
    })
  }
}

exports.login = async (req, res) => {
  let user = req.user

  // console.log(user)

  let payload = {
    id: user.id,
    password: user.hashed_password,
  }

  // console.log(payload)

  try {
    const token = await sign(payload, SECRET)

    return res.status(200).cookie('token', token, { httpOnly: true }).json({
      success: true,
      message: 'Logged in succefully',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      error: error.message,
    })
  }
}

exports.dropcourse = async (req, res) => {
  try{
    let course = req.body
    await db.query('delete from takes where ID = $1 and course_id = $2 and semester = $3 and year = $4',[
      course.id, course.course_id, course.semester, course.year
    ])

    return res.status(200)
  } catch (error) {
    console.log(error.message)
  }

}

exports.runningdept = async (req, res) => {
  try {
    var cur_year = 2010
    var cur_sem = 'Spring'
    var result = await db.query('select distinct dept_name from section natural join course where year = $1 and semester = $2',[cur_year, cur_sem])
    console.log(result.rows)
    let payload = {
      depts: result.rows
    }
    console.log(payload)

    return res.status(200).end(JSON.stringify(payload))
  } catch (error) {
    console.log(error.message)
  }
}

exports.runningdeptcourses = async (req, res) => {
  try {
    console.log(req.body)
    var cur_year = 2010
    var cur_sem = 'Spring'
    var result = await db.query('select distinct (course_id, title) from section natural join course where year = $1 and semester = $2 and dept_name = $3',[cur_year, cur_sem, dept_name])
    console.log(result.rows)
    let payload = {
      courses: result.rows
    }
    console.log(payload)

    return res.status(200).end(JSON.stringify(payload))
  } catch (error) {
    console.log(error.message)
  }
}

//Changed function
exports.registration = async (req, res) => {
  try {
    var cur_year = 2010
    var cur_sem = 'Spring'
    var result = await db.query('select * from student where ID = $1',[req.user.id])
    var result2 = await db.query('select * from takes where ID = $1 and ( year < $2 or (year = $2 and semester < $3))  ORDER BY year desc, semester desc',[req.user.id, cur_year, cur_sem])
    var result3 = await db.query('select course_id from takes where ID = $1 and year = $2 and semester = $3',[req.user.id, cur_year, cur_sem])
    var result4 = await db.query(' select course_id, title, array_agg(sec_id) as sec_id from section natural join course where course_id not in (select course_id from takes where ID = $1 and year = $2 and semester = $3) and year=$2 and semester=$3 group by course_id,title',[req.user.id,cur_year,cur_sem])

    // select course_id, title, sec_id from section natural join course where year=2010 and semester='Spring'
    console.log(result3.rows)
    console.log(result4.rows)
    
    let payload = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      dept_name: result.rows[0].dept_name,
      tot_cred: result.rows[0].tot_cred,
      cur_courses: result3.rows,
      courses: result2.rows,
      cur_year: cur_year,
      cur_sem: cur_sem,
      all_run_courses: result4.rows,
      all_search_courses: result4.rows
    }
    console.log(payload)

    return res.status(200).end(JSON.stringify(payload))
  } catch (error) {
    console.log(error.message)
  }
}

//Newly adde function
exports.registerForCourse = async (req, res) => {
  var cur_year = 2010
  var cur_sem = 'Spring'
  var { id, course_id, sec_id, title } = req.body
  try {
    console.log(req.body)
    
    var prereq =await db.query('select prereq_id from prereq where prereq_id not in (select course_id from takes where ID=$1 and (year<$2 or (year=$2 and semester!=$3))) and course_id=$4',[id,cur_year,cur_sem,course_id])

    console.log(prereq)

    if (prereq.rowCount>=1) {
      throw new Error('Prerequisites not satisfied! Registration unsuccessful.')
    }

    var timeclash=await db.query('select course_id from section natural join takes where ID=$1 and time_slot_id in (select time_slot_id from section where course_id=$2 and sec_id=$3 and semester=$4 and year=$5)',[id,course_id,sec_id,cur_sem,cur_year])
    console.log(timeclash)
    if(timeclash.rowCount>=1){
      throw new Error('Time_slot clash! Registration unsuccessful.')
    }

    const grade=null

    await db.query('Insert into takes(ID,course_id,sec_id,semester,year,grade) values($1,$2,$3,$4,$5,$6)',[id,course_id,sec_id,cur_sem,cur_year,grade])

    return res.status(201).json({
      success: true,
      message: 'Registration was successfull',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      error: error.message,
    })
  }
}

exports.protected = async (req, res) => {
  try {
    var cur_year = 2010
    var cur_sem = 'Spring'
    var first_sem='Spring'
    var second_sem='Summer'
    var third_sem='Fall'
    var result = await db.query('select * from student where ID = $1',[req.user.id])
    var result2 = await db.query('select * from takes where ID = $1 and ( year < $2 or (year = $2 and semester < $3))  ORDER BY year desc, semester desc',[req.user.id, cur_year, cur_sem])
    var result3 = await db.query('select * from takes where ID = $1 and year = $2 and semester = $3',[req.user.id, cur_year, cur_sem])
    var result4 = await db.query('select year,semester, array_agg(id||\',\'||course_id||\',\'||title||\',\'||sec_id||\',\'||grade ) as rows from takes natural join course where ID=$1 and (year<$2 or (year=$2 and semester!=$3)) group by year,semester order by year desc,case when semester=\'Spring\' then 1 when semester=\'Summer\' then 2 when semester=\'Fall\' then 3 else 4 end asc ',[req.user.id,cur_year,cur_sem])

    console.log(result4.rows)
    
    let payload = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      dept_name: result.rows[0].dept_name,
      tot_cred: result.rows[0].tot_cred,
      cur_courses: result3.rows,
      courses: result4.rows,
      cur_year: cur_year,
      cur_sem: cur_sem
    }
    console.log(payload)

    return res.status(200).end(JSON.stringify(payload))
  } catch (error) {
    console.log(error.message)
  }
}


exports.logout = async (req, res) => {
  try {
    return res.status(200).clearCookie('token', { httpOnly: true }).json({
      success: true,
      message: 'Logged out succefully',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      error: error.message,
    })
  }
}

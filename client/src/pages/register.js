import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchRegistrationInfo, onLogout, onRegister } from '../api/auth'
import Layout from '../components/layout'
import { unauthenticateUser } from '../redux/slices/authSlice'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import "../css/table.css"
import "../css/basic.css"

const Register = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [protectedData, setProtectedData] = useState(null)
  const [error, setError] = useState(false)

  const logout = async () => {
    try {
      await onLogout()

      dispatch(unauthenticateUser())
      localStorage.removeItem('isAuth')
    } catch (error) {
      console.log(error.response)
    }
  }


  const protectedInfo = async () => {
    try {
      var data  = await fetchRegistrationInfo()
      setProtectedData(data)
      console.log(data)

      setLoading(false)
    } catch (error) {
      logout()
    }
  }

  useEffect(() => {
    protectedInfo()
  }, [])

  
  function refreshPage() {
      window.location.reload(false);
  }

  const handleOnSearch = (string, results) => {
    setError("")
    setProtectedData((prevState) => {
      console.log(prevState)
      return {
        ...prevState,
        data:{...prevState.data,
              all_search_courses:(string.length===0)?prevState.data.all_run_courses:results
        }
      };
    });
    console.log(string, results)
  }

  const handleOnHover = (result) => {
    console.log(result);
  };

  const handleOnSelect = (item) => {
    setError("")
    setProtectedData((prevState) => {
      console.log(prevState)
      return {
        ...prevState,
        data:{...prevState.data,
              all_search_courses:[item]
        }
      };
    });
    console.log(protectedData.data);
  };

  const handleOnFocus = () => {
    console.log("Focused");
  };

  const handleOnClear = () => {
    setError("")
    refreshPage()
    console.log("Cleared");
  };

  const formatResult = (item) => {
    return (
      <div style={{ cursor: "pointer" }}>
        <strong style={{ display: "block", textAlign: "left" }}>
          {item.title}
        </strong>
        <span style={{ display: "block", textAlign: "left" }}>
          {item.course_id}
        </span>
      </div>
    );
  };

//   const all_run_courses= [
//     {
//       id: '1',
//       course_id: 'CS-101',
//       title: 'Intro. to Computer Science',
//       sec_id: '1'
//     },
//     { id:'2',
//       course_id: 'CS-315', title: 'Robotics', sec_id:
//  '1' },
//     { id:'3',course_id: 'CS-319', title: 'Image Processing', sec_id: '1' },
//     { id:'4',course_id: 'CS-319', title: 'Image Processing', sec_id: '2' },
//     { id:'5',course_id: 'FIN-201', title: 'Investment Banking', sec_id: '1' },
//     { id:'6',course_id: 'HIS-351', title: 'World History', sec_id: '1' },
//     {
//       id:'7',
//       course_id: 'MU-199',
//       title: 'Music Video Production',
//       sec_id: '1'
//     }
  // ]
  // var all_run_array=JSON.parse()

  // const fuseOptions_={
  //     shouldSort: true,
  //     threshold: 0.6,
  //     location: 0,
  //     distance: 100,
  //     maxPatternLength: 32,
  //     minMatchCharLength: 1,
  //     keys: [
  //       "cousrse_id",
  //       "title"
  //     ]
  //   }

  const registerCourse = async (course,selectedValue) => {
    try {
      const courseData={id:protectedData.data.id,
                        course_id:course.course_id,
                        sec_id:selectedValue,
                        title:course.title
                      }
      console.log(courseData)
      await onRegister(courseData)
      setError("")
      protectedInfo()
    } catch (error) {
      console.log(error.response.data.errors[0].msg)
      setError(error.response.data.errors[0].msg)
    }
  }

  function TableRow({ key,rowData }) {
    const [selectedValue, setSelectedValue] = useState(rowData.sec_id[0]);
    const handleChange = event => {
      setSelectedValue(event.target.value);
      console.log(selectedValue)
    };
  
    return (
      <tr key={key}>
        <td>{rowData.course_id}</td>
        <td>{rowData.title}</td>
        <td>
          <select value={selectedValue} onChange={handleChange}>
            {rowData.sec_id.map(option => (
              <option key={option.key} value={option}>
                {option}
              </option>
            ))}
          </select>
        </td>
        <td><button onClick={() => registerCourse(rowData,selectedValue)} className='btn btn-primary'>Register</button>
        </td>
      </tr>
    );
  }
  

  return loading ? (
    <Layout>
      <h1>Loading...</h1>
    </Layout>
  ) : (
    <div>
      <Layout>
        <h1>Registration Details</h1>
        <ReactSearchAutocomplete
          // items={all_run_courses}
          items={protectedData.data.all_run_courses}
          fuseOptions={{keys:["course_id","title"]}}
          resultStringKeyName="title"
          onSearch={handleOnSearch}
          onHover={handleOnHover}
          onSelect={handleOnSelect}
          onFocus={handleOnFocus}
          onClear={handleOnClear}
          styling={{ zIndex: 4 }} // To display it on top of the search box below
          autoFocus
          formatResult={formatResult}
          placeholder="Search for courses to register"
        />
        <br></br>
        <table>
          <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Section</th>
            <th>Register</th>
          </tr>
          </thead>
          <tbody>
            {protectedData.data.all_search_courses.map((course) => (
            <TableRow key={course.id} rowData={course}/>
          ))}
          </tbody>
        </table>
        <br></br>
        <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>
      </Layout>
    </div>
  )
}

export default Register

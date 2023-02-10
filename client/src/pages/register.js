import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchRegistrationInfo, onLogout } from '../api/auth'
import Layout from '../components/layout'
import { unauthenticateUser } from '../redux/slices/authSlice'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'


const Register = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [protectedData, setProtectedData] = useState(null)
  var items = null

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
      console.log("HIIIIIIIIIIIIII")
      items = data.data.courses
      console.log(items)
      console.log("BYEEEEEEEEEEEEE")
      setProtectedData(data)

      setLoading(false)
    } catch (error) {
      logout()
    }
  }

  useEffect(() => {
    protectedInfo()
  }, [])


  const handleOnSearch = (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
    console.log(string, results)
  }

  const handleOnHover = (result) => {
    // the item hovered
    console.log(result)
  }

  const handleOnSelect = (item) => {
    // the item selected
    console.log('SELECTED')
    console.log(item)
  }

  const handleOnFocus = () => {
    console.log('Focused')
  }

  const formatResult = (item) => {
    return (
      <>
        <span style={{ display: 'block', textAlign: 'left' }}>course_id: {item.course_id}</span>
        <span style={{ display: 'block', textAlign: 'left' }}>title: {item.title}</span>
      </>
    )
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
            items={protectedData.data.courses}
            fuseOptions={{ keys: ["course_id", "title"] }}
            resultStringKeyName="course_id"
            onSearch={handleOnSearch}
            onHover={handleOnHover}
            onSelect={handleOnSelect}
            onFocus={handleOnFocus}
            autoFocus
            formatResult={formatResult}
          />
      </Layout>
    </div>
  )
}

export default Register

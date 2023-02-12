import Navbar from './navbar'
import "../css/navbar.css"

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div className='container'>{children}</div>
    </div>
  )
}

export default Layout

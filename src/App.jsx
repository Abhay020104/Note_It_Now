import { Toaster } from 'react-hot-toast'
import HomePage from './pages/HomePage'
import { Route, Routes } from 'react-router'
import LoginPage from './pages/LoginPage'
import { getCurrentUser } from './services/authService'
import { Navigate } from 'react-router-dom'


function App() {
  const PrivateRoute = ({ children }) => {
    return getCurrentUser() ? children : <Navigate to='/signin' />
  }

  return (
    <>
      <Toaster />
      <Routes>
        <Route path='/' element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path='/signin' element={<LoginPage />} />
        <Route path='*' element={<Navigate to='/signin' />} />
      </Routes>
    </>
   
  )
}

export default App

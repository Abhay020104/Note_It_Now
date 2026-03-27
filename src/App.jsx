import { Toaster } from 'react-hot-toast'
import HomePage from './pages/HomePage'
import { Route, Routes, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import { getCurrentUser } from './services/authService'


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

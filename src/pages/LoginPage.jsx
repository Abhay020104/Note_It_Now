import React, { use } from 'react'
import NavbarComponent from '../components/Navbar'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import { loginWithEmail, loginWithGoogle } from '../services/authService'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleEmailLogin = async (e) => {
        e.preventDefault()

        if (!email.trim() || !password.trim()) {
            toast.error("Email and password cannot be empty!")
            return
        }

        try {
            await loginWithEmail(email, password)
            toast.success("Logged in successfully!")
            navigate('/')
        } catch (error) {
            if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                try {
                    const newUserCredential = await createUserWithEmailAndPassword(auth, email, password);
                    console.log("Logged in successfully!", newUserCredential.user);
                    
                } catch (signUpError) {
                    console.error("Failed to create account:", signUpError.message);
                }
            } else {
                    toast.error("Invalid authentication!")
                }
        }
    }

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle()
            toast.success("Logged in successfully!")
            navigate('/')
        } catch (error) {
            toast.error("Invalid authentication!")
        }
    }
    
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate('/')
            }
        })
    }, [navigate])

  return (
    <>
      <NavbarComponent />
        <div className='flex flex-col items-center justify-center min-h-screen'>
            <div className="flex flex-col items-center justify-center p-15 bg-purple-100 border border-gray-100 rounded-xl shadow-xl">
                <h1 className='text-lg text-center text-purple-800 font-semibold mb-4'>Please login!</h1>
                <form className='flex flex-col gap-3 w-80' onSubmit={handleEmailLogin}>
                    <input 
                        type='email' 
                        placeholder='Email' 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='w-full p-2 bg-white rounded-md border' 
                        />
                    <input 
                        type='password' 
                        placeholder='Password' 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='w-full mb-3 p-2 bg-white rounded-md border' 
                        />
                <button type='submit' className='bg-purple-600 text-white p-2 rounded-md hover:bg-purple-700 transition'>Login</button>
                </form>

                <span className='my-4 text-center text-sm font-bold text-purple-600'>--- Or ---</span>
                <button onClick={handleGoogleLogin} className='bg-blue-600 text-white text-sm px-3 py-2 rounded-md hover:bg-blue-700 transition'>Login with Google</button>
            </div>
      </div>
    </>
  )
}

export default LoginPage

import React from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { logout } from '../services/authService'


const NavbarComponent = () => {
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
        })
        return () => {
            unsubscribe()
        }
    }, [])

    const handleLogout = async () => {
        await logout()
        navigate('/signin')
    }

    return (
        <>
            <nav className="flex w-full justify-between items-center bg-purple-100 shadow-md py-3 px-10">
                <div className="flex gap-1 justify-center items-center cursor-pointer">
                    <img src="src/assets/logo.png" alt="logo" className="w-6 h-6" />
                    <p className="text-lg font-semibold text-purple-500 hover:text-purple-700 transition ease-in-out">
                        NIN 
                    </p>
                </div>

                <div className="flex gap-6 justify-center items-center text-purple-900 font-semibold">
                    {user ? (
                        <button onClick={handleLogout} className="bg-red-600 text-white text-sm py-2 px-6 rounded-md hover:bg-purple-700 transition ease-in-out">
                            Logout
                        </button>
                    ) : (
                        <a href="/signin" className="bg-purple-800 text-white text-sm py-2 px-6 rounded-md hover:bg-purple-700 transition ease-in-out">
                            Login
                        </a>
                    )}
                </div>
            </nav>
        </>
    )
}

export default NavbarComponent
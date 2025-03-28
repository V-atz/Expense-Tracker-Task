import React from 'react'
import { useExpenseContext } from './contexts/expenseContext'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({children}) {
    const {user} = useExpenseContext()
    const isAuthenticated = (user!==null)

    //if not authenticated
    if(!isAuthenticated) {
        return <Navigate to='login'/>
    }

    //if authenticated
    return children
}

export default ProtectedRoute

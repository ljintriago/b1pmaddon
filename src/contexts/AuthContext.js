import React, { useContext, useState } from 'react'
import axios from 'axios'
import configData from "../data/LogInConfig.json"

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState()
    //const [loading, setLoading] = useState(true)

    function login(user, password) {
        const logindata = { CompanyDB: configData["companyDB"] , UserName: user ,Password: password }
        return axios.post(configData["url"] + "Login", logindata, {withCredentials:true})
        //.then(res => {return res})
        //.catch(err => {return err})
    }

    const value = {
        currentUser,
        login
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

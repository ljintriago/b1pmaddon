import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import configData from "../data/LogInConfig.json"
import { useNavigate } from "react-router-dom"

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState()
    const navigate = useNavigate()
    const [sto, setSto] = useState(0)
    const [toiApp, setToiApp] = useState(0)
    const [resSessionTimeFlag, setResSessionTimeFlag] = useState(0)
    //const [loading, setLoading] = useState(true)

   /*  useEffect(() => {
        if (sto!==0){
            console.log("settimeout")
        setToiApp(setTimeout(() => {
            if(!window.alert("Se ha cerrado la sesión por inactividad"))
            {
                navigate("/login")
            }
        },sto * 60000))
        }
    }, [sto, resSessionTimeFlag]) */

    function login(user, password) {
        const logindata = { CompanyDB: configData["companyDB"] , UserName: user ,Password: password }
        return axios.post(configData["url"] + "Login", logindata, {withCredentials:true})
        .then(res => setSto( res.data["SessionTimeout"] ))
        //.catch(err => {return err})
    }

    const value = {
        currentUser,
        login,
        resSessionTimeFlag,
        setResSessionTimeFlag,
        toiApp
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

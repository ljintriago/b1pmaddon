import React, { useRef, useState } from 'react'
import {
    FlexBox,
    FlexBoxAlignItems,
    FlexBoxDirection,
    FlexBoxJustifyContent,
    ShellBar,
    Label,
    Input,
    InputType,
    Button,
    ButtonDesign,
    Toast
  } from '@ui5/webcomponents-react';
import "@ui5/webcomponents/dist/features/InputElementsFormSupport.js";
import { useAuth } from "../../../contexts/AuthContext"
import "../assets/LogIn.css"
import configData from "../../../data/LogInConfig.json"
import { useNavigate } from "react-router-dom"


export default function LogInForm() {
  const userRef = useRef()
  const passRef = useRef()
  const { login } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const company = configData["companyDB"] 
  const toast = useRef()
  const navigate = useNavigate()

  const showToast = () => {
    toast.current.show();
  };
  
  async function handleSubmit(e) {
    e.preventDefault()
    try{
      setError("")
      setLoading(true)
      const response = await login(userRef.current.value, passRef.current.value)
      console.log(response)
      navigate("/massPayments")
    }catch{
      setError("Credenciales inválidas")
      setLoading(false)
      showToast()
    }
  }

  return (
    <>
      <ShellBar primaryTitle="Pagos Masivos Log In" />
      
      <FlexBox
        style={{ width: '100%', height: '100vh' }}
        direction={FlexBoxDirection.Column}
        justifyContent={FlexBoxJustifyContent.Center}
        alignItems={FlexBoxAlignItems.Center}
      >
        
        <FlexBox
        style={{ height: '75px' }}  
        direction={FlexBoxDirection.Column}>
          <Label for="companydb">CompanyDB:</Label>
          <Input name="companydb" value={ company } readonly="true"/>
        </FlexBox>
        <FlexBox
        direction={FlexBoxDirection.Column}>
          <Label for="usuario">Usuario:</Label>
          <Input name="usuario" ref={userRef} required/>
        </FlexBox>
        <FlexBox
        style={{ height: '65px' }} 
        direction={FlexBoxDirection.Column}>
          <Label for="pass">Contraseña:</Label>
          <Input type={InputType.Password} name="pass" ref={passRef} required/>
        </FlexBox>
        <FlexBox>
          <Button disabled={loading} children="Log In" design={ButtonDesign.Emphasized} onClick={handleSubmit}/>
        </FlexBox>
        
      </FlexBox>
      <Toast ref={ toast } >
        { error }
      </Toast>
    </>
  )
}

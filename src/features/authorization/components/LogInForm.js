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
    Card
  } from '@ui5/webcomponents-react';
import { useAuth } from "../../../contexts/AuthContext"
import "../assets/LogIn.css"

export default function LogInForm() {
  const userRef = useRef()
  const passRef = useRef()
  const { login } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false) 

  async function handleSubmit(e) {
    e.preventDefault()

    try{
      setError("")
      setLoading(true)
      await login(userRef.current.value, passRef.current.value)
    }catch{
      setError("Credenciales inválidas")
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
          <Input name="companydb" readonly="true"/>
        </FlexBox>
        <FlexBox
        direction={FlexBoxDirection.Column}>
          <Label for="usuario">Usuario:</Label>
          <Input name="usuario"/>
        </FlexBox>
        <FlexBox
        style={{ height: '65px' }} 
        direction={FlexBoxDirection.Column}>
          <Label for="pass">Contraseña:</Label>
          <Input type={InputType.Password} name="pass"/>
        </FlexBox>
        <FlexBox>
          <Button disabled={loading} children="Log In" design={ButtonDesign.Emphasized} onClick={handleSubmit}/>
        </FlexBox>
        
      </FlexBox>
      
    </>
  )
}

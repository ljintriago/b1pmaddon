import React, { useEffect, useState } from 'react'
import { 
  ShellBar,
  DynamicPage,
  DynamicPageTitle,
  Button,
  Title,
  Label,
  Badge,
  DateRangePicker,
  FlexBox,
  FlexBoxDirection,
  DynamicPageHeader,
  CheckBox
 } from '@ui5/webcomponents-react';
 import axios from 'axios'
 import configData from "../../../data/LogInConfig.json"
 import SAPTableComponent from '../../../components/Table';

export default function MassivePayments() {
  const [dataTable, setDataTable] = useState([])
  console.log(dataTable)

  useEffect(() => {
    axios.get(configData["url"] + 'sml.svc/CA_PAYWIZ')
    .then(res => setDataTable(res.data))
    .catch(err => console.log(err))
  }, [])

  const column = [
    {heading: 'ID', value: 'IdNumber'},
    {heading: 'Nombre de ejecución', value:'WizardName'},
    {heading: 'Fecha de ejecución', value:'PmntDate'},
    {heading: 'Usuario', value:'U_NAME'},
    {heading: 'Monto', value:'PymDocAmnt'},
    {heading: 'Generado', value:'U_U_GENARC'}
    ]

  return (
    <>
      <ShellBar primaryTitle="Powered by SEIDOR S.A." />
      <div>
        <DynamicPage
          headerContent={<DynamicPageHeader><FlexBox wrap="Wrap"><FlexBox direction="Row"><CheckBox text="Mostrar archivos generados"/></FlexBox></FlexBox></DynamicPageHeader>}
 
          headerTitle={<DynamicPageTitle actions={<><Button design="Transparent">Generar Archivo</Button></>} header={<Title>Pagos Masivos</Title>} subHeader={<FlexBox direction={FlexBoxDirection.Column}><Label>Rango de fechas</Label><DateRangePicker/></FlexBox>}><Badge>Status: OK</Badge></DynamicPageTitle>}
        >
          <SAPTableComponent data={dataTable} column={column}/>  
        </DynamicPage>
      </div>
    </>
    
  )
}

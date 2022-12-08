import React, { useEffect, useState } from 'react'
import { 
  ShellBar,
  DynamicPage,
  DynamicPageTitle,
  Button,
  Title,
  Label,
  DateRangePicker,
  FlexBox,
  FlexBoxDirection,
  DynamicPageHeader,
  CheckBox,
  ComboBox,
  ComboBoxItem
 } from '@ui5/webcomponents-react';
 import axios from 'axios'
 import configData from "../../../data/LogInConfig.json"
 import bankOptions from "../../../data/BankOptions.json"
 import SAPTableComponent  from '../../../components/Table'

export default function MassivePayments() {
  const [dataTable, setDataTable] = useState([])
  const [dates, setDates] = useState([])
  const [checkState, setCheckState] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])
  const [bankPicked, setBankPicked] = useState("")
  const currentdate = new Date()
  const fileName = "PAGOS_MASIVOS_"+ bankPicked.replace(" ", "") +  currentdate.getDate() + (currentdate.getMonth()+1) + currentdate.getFullYear() + currentdate.getHours() + currentdate.getMinutes() + ".txt"

  console.log(fileName)

  useEffect(() => {
    axios.get(configData["url"] + 'sml.svc/CA_PAYWIZ?$filter=U_U_GENARC eq null', {withCredentials:true})
    .then(res => setDataTable(res.data["value"]))
    .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    axios.get(configData["url"] + 'sml.svc/CA_PAYWIZ?$filter=PmntDate ge \''+ dates[0] +'\' and PmntDate le \''+ dates[1] +'\'', {withCredentials:true})
    .then(res => setDataTable(res.data["value"]))
    .catch(err => console.log(err))
  }, [dates])

  useEffect(() => {
    if(checkState){
      axios.get(configData["url"] + 'sml.svc/CA_PAYWIZ', {withCredentials:true})
      .then(res => setDataTable(res.data["value"]))
      .catch(err => console.log(err))
    }else{
      axios.get(configData["url"] + 'sml.svc/CA_PAYWIZ?$filter=U_U_GENARC eq null', {withCredentials:true})
      .then(res => setDataTable(res.data["value"]))
      .catch(err => console.log(err))
    }
  }, [checkState])
  
  function handleFilter(e){
    setDates(e.detail["value"].split(" - "))
  }

  function handleCheck(e){
    setCheckState(e.target["_state"]["checked"])
  }

  function handlePick(e){
    setBankPicked(e.srcElement["_state"]["value"])
  }

  function fileDownload(fileTextContent){
    const blob = new Blob([fileTextContent])
    const fileDownloadUrl = URL.createObjectURL(blob)
    this.setState ({fileDownloadUrl: fileDownloadUrl}, 
      () => {
        this.dofileDownload.click(); 
        //URL.revokeObjectURL(fileDownloadUrl)  // free up storage--no longer needed.
        this.setState({fileDownloadUrl: ""})
      }) 
  }

  async function handleGenArch(e){
    e.preventDefault()
    selectedRowsFromChildToParent()
    if(bankPicked === "" && selectedRows.length === 0){
      console.log("No se ha escogido ninguna opción de formato, ni se ha seleccionado ningún conjunto de pagos")
    }else if(bankPicked !== "" && selectedRows.length === 0){
      console.log("No se ha seleccionado ningún conjunto de pagos")
    }else if(bankPicked === "" && selectedRows.length !== 0){
      console.log("No se ha escogido ninguna opción de formato")
    }else{
      const requests = []
      const regPayments = []
      const docEntries = []
      const result = []
      let format = ""
      let archgen = ""

      bankOptions.options.map((bank,index) => {
        if(bank.name === bankPicked) format = bank.selectedDataFromView
        else return
      })

      for(let i = 0; i < selectedRows.length; i++){
        requests.push(axios.get(configData["url"] + 'sml.svc/CA_PAYMENTS?$select=PaymDocNum&$filter=IdNumber eq ' + selectedRows[i], {withCredentials:true}))
      }

      const response = await Promise.allSettled(requests)

      response.forEach((item) => {
        if(item.status === "rejected") return
        item.value.data.value.map((val,index) => {
          docEntries.push(val["PaymDocNum"]) 
        })
      })


      for(let i = 0; i < docEntries.length; i++){
        regPayments.push(axios.get(configData["url"] + 'sml.svc/CA_MASSPAYINFOParameters(IP_PAYDE=' + docEntries[i] + ')/CA_MASSPAYINFO' + format, {withCredentials:true}))
      }

      const paymentsResponse = await Promise.allSettled(regPayments)

      paymentsResponse.forEach((item) => {
        if(item.status === "rejected") return
        result.push(item.value.data.value[0])
      })      
      
      let secuencial = 1

      result.forEach((res) => {
        const resArr = Object.keys(res).map(key => res[key])
        
        resArr.forEach((line) => {
          if (line === null) line = ""
          if (resArr.indexOf(line) === 2) line = secuencial
          if (resArr.indexOf(line) === resArr.length - 1) line = line + '\n'
          else line = line + '\t'
          
          archgen += line
       })
       secuencial ++
      })

      fileDownload(archgen)
    }

  }

  const selectedRowsFromChildToParent = (childSelectedRows) => {
    setSelectedRows(childSelectedRows)
  }

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
          headerContent={<DynamicPageHeader><FlexBox wrap="Wrap"><FlexBox direction="Column"><FlexBox direction={FlexBoxDirection.Column}><Label>Rango de fechas</Label><DateRangePicker onChange={handleFilter} formatPattern="yyyy-MM-dd"/></FlexBox><CheckBox text="Mostrar archivos generados" onChange={handleCheck}/></FlexBox></FlexBox></DynamicPageHeader>}
 
          headerTitle={<DynamicPageTitle actions={<><ComboBox onChange={handlePick} placeholder='Escoger banco'>{bankOptions.options.map((item, index) => <ComboBoxItem text={item.name}/>)}</ComboBox><Button onClick={handleGenArch} design="Transparent">Generar Archivo</Button><a className="hidden" download={fileName} href={this.state.fileDownloadUrl} ref={e=>this.dofileDownload = e}>download it</a></>} header={<Title>Pagos Masivos</Title>} subHeader={<FlexBox></FlexBox>}></DynamicPageTitle>}
        >
          <SAPTableComponent data={dataTable} column={column} selectedRowsFromChildToParent={selectedRowsFromChildToParent}/>  
        </DynamicPage>
      </div>
    </>
    
  )
}

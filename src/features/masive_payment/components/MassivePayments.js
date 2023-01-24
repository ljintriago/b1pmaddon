import React, { useEffect, useRef, useState } from 'react'
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
  FlexBoxAlignItems,
  DynamicPageHeader,
  CheckBox,
  ComboBox,
  ComboBoxItem,
  BusyIndicator,
  Badge,
  Icon,
  IllustratedMessage ,
  IllustrationMessageType,
  SelectDialog,
  StandardListItem
 } from '@ui5/webcomponents-react';
 import axios from 'axios'
 import configData from "../../../data/LogInConfig.json"
 import bankOptions from "../../../data/BankOptions.json"
 import SAPTableComponent  from '../../../components/Table'
 import "@ui5/webcomponents-icons/dist/AllIcons.js"
 import "@ui5/webcomponents-fiori/dist/illustrations/AllIllustrations.js"
 import { useAuth } from "../../../contexts/AuthContext"

export default function MassivePayments() {
  //let cmbBancoRef = useRef()
  let dofileDownload = useRef()
  //let accountData = useRef([])
  const { resSessionTimeFlag,setResSessionTimeFlag, toiApp } = useAuth()
  const [pageStatus, setPageStatus] = useState(false)
  const [accountSelector, setAccountSelector] = useState(false)
  const [accSelected, setAccSelected] = useState("")
  const [accountData, setAccountData] = useState([])
  const [dataTable, setDataTable] = useState([])
  const [dates, setDates] = useState([])
  const [checkState, setCheckState] = useState(false)
  const [bankPicked, setBankPicked] = useState(["",""])
  const [fileDownloadUrl, setFileDownloadUrl] = useState("")
  const [biactivator, setBiactivator] = useState(false)
  const currentdate = new Date()
  let fileName = "PAGOS_MASIVOS_"+ bankPicked[1].replace(" ", "") +  currentdate.getDate() + (currentdate.getMonth()+1) + currentdate.getFullYear() + currentdate.getHours() + currentdate.getMinutes() + ".txt"
  let selectedRows = []
 

 /*  useEffect(() => {
    axios.get(configData["url"] + 'sml.svc/CA_PAYWIZ?$filter=U_U_GENARC eq null', {withCredentials:true})
    .then(res => setDataTable(res.data["value"]))
    .catch(err => console.log(err))
  }, []) */

 /*  useEffect(() => {
    if (dates.length!==0) {
      axios.get(configData["url"] + 'sml.svc/CA_PAYWIZ?$filter=PmntDate ge \''+ dates[0] +'\' and PmntDate le \''+ dates[1] +'\'', {withCredentials:true})
    .then(res => setDataTable(res.data["value"]))
    .catch(err => console.log(err))
    } else {
      axios.get(configData["url"] + 'sml.svc/CA_PAYWIZ?$filter=U_U_GENARC eq null', {withCredentials:true})
      .then(res => setDataTable(res.data["value"]))
      .catch(err => console.log(err))
    }
  }, [dates]) */

  /* useEffect(() => {
    if(checkState){
      axios.get(configData["url"] + 'sml.svc/CA_PAYWIZ', {withCredentials:true})
      .then(res => setDataTable(res.data["value"]))
      .catch(err => console.log(err))
    }else{
      axios.get(configData["url"] + 'sml.svc/CA_PAYWIZ?$filter=U_U_GENARC eq null', {withCredentials:true})
      .then(res => setDataTable(res.data["value"]))
      .catch(err => console.log(err))
    }
  }, [checkState]) */

  useEffect(() => {
    if(accSelected !== ""){

      let filters = ""

      if(!checkState) {
        filters = " and U_U_GENARC eq null"
      }

      if(dates.length !== 0) {
        filters += " and PmntDate ge '"+ dates[0] +"' and PmntDate le '"+ dates[1] +"'"
      }

      axios.get(configData["url"] + 'sml.svc/CA_PAYWIZ?$filter=PymBnkAcct eq \'' + accSelected + '\' and PymBnkCode eq \'' + bankPicked[0] + '\'' + filters, {withCredentials:true})
    .then(res => {
      console.log(toiApp)
      clearTimeout(toiApp)
      resSessionTimeFlag === 0 ? setResSessionTimeFlag(1) : setResSessionTimeFlag(0)
      setDataTable(res.data["value"])
    })
    .catch(err => console.log(err))
    }

  },[accSelected, dates, checkState, bankPicked])

  useEffect(() => {
    if(bankPicked.length !== 0) {
      axios.get(configData["url"] + 'HouseBankAccounts?$select=AccNo,AccountName&$filter=BankCode eq \'' + bankPicked[0] + '\'', {withCredentials:true})
    .then(res => {
      console.log(toiApp)
      clearTimeout(toiApp)
      resSessionTimeFlag === 0 ? setResSessionTimeFlag(1) : setResSessionTimeFlag(0)
      setAccountData(res.data["value"])
    })
    .catch(err => console.log(err))
    }
  }, [bankPicked])

  useEffect(() => {
    if (fileDownloadUrl !== ""){
      dofileDownload.click();
      setBiactivator(false)
    }  
  }, [fileDownloadUrl])
  
  function handleFilter(e){
    setDates(e.detail["value"].split(" - "))
  }

  function handleCheck(e){
    setCheckState(e.target["_state"]["checked"])
  }

  function handleAccChange(e){
    setPageStatus(true)
    const cmbAccount = document.getElementById("cmbAccount")
    for (let i=0; i < cmbAccount.children.length; i++)
    {
      if (cmbAccount.children[i].selected) 
      {
        setAccSelected(cmbAccount.children[i].additionalText)
      }
      
    }
  }

  function handlePick(e){
    setAccountSelector(true)
    setPageStatus(false)

    const cbGenArch = document.getElementById("cbGenArch")
    const cmbAccount = document.getElementById("cmbAccount")
    const drpFechasAP = document.getElementById("drpFechasAP")
    cbGenArch.checked = false
    cmbAccount.value = ""
    drpFechasAP.value = ""

    setBankPicked([e.detail["selectedItems"][0]["id"], e.detail["selectedItems"][0]["innerText"]])

    setAccSelected("")
    setDataTable([])
    
  }

  const handleSelection = (e) => {
    let selectedRowsArray = []
    let selectedRowslen = 0
   
    selectedRowslen=e.detail["selectedRows"].length
    for (let i = 0; i < selectedRowslen; i++) {
      selectedRowsArray.push(e.detail["selectedRows"][i]["childNodes"][0]["innerText"]);
    }

    selectedRows = selectedRowsArray 
  }

  function fileDownload(fileTextContent){
    const blob = new Blob([fileTextContent])
    setFileDownloadUrl(URL.createObjectURL(blob))
  }

  async function handleGenArch(e){
    e.preventDefault()
    if(bankPicked.length === 0 && selectedRows.length === 0){
      console.log("No se ha escogido ninguna opción de formato, ni se ha seleccionado ningún conjunto de pagos")
    }else if(bankPicked.length !== 0 && selectedRows.length === 0){
      console.log("No se ha seleccionado ningún conjunto de pagos")
    }else if(bankPicked.length === 0 && selectedRows.length !== 0){
      console.log("No se ha escogido ninguna opción de formato")
    }else{
      
      setBiactivator(true)
      const requests = []
      const regPayments = []
      const docEntries = []
      const result = []
      const setDatePayments = []
      let format = ""
      let archgen = ""

      bankOptions.options.map((bank,index) => {
        if(bank.name === bankPicked[1]) format = bank.selectedDataFromView
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
      

      if(docEntries.length === result.length) {
        let secuencial = 1
        

        result.forEach((res) => {
          const resArr = Object.keys(res).map(key => res[key])
          let iterador = 0
          resArr.forEach((line) => {
            if (line === null) line = ""
            if (resArr.indexOf(line) === 2 && bankPicked[0] !== "0010") line = secuencial
            if (resArr.lastIndexOf(line) === resArr.length - 1 && iterador === resArr.length-1) line = line + '\n'
            else line = line + '\t'
            
            archgen += line
            iterador ++
        })
        secuencial ++
        })


        fileDownload(archgen)
        selectedRows = []
        
        
        for(let i = 0; i < docEntries.length; i++){
          const payGenDate = { U_U_GENARC: currentdate.getFullYear() + '-' + (currentdate.getMonth()+1) + '-' + currentdate.getDate() } 
          setDatePayments.push(axios.patch(configData["url"] + 'VendorPayments(' + docEntries[i] + ')',payGenDate, {withCredentials:true}))
        }

        clearTimeout(toiApp)
        resSessionTimeFlag === 0 ? setResSessionTimeFlag(1) : setResSessionTimeFlag(0)
      }
      else{
        console.log("No se pudo cargar los pagos seleccionados")
      }

    }

  }

  function openBankSelector(e){
    e.preventDefault()
    let bankDialog = document.getElementById("bankSelector")
    bankDialog.show()
  }

  const PageContent = () => {
    if(pageStatus === true) {
      if(dataTable.length === 0) {
        return <IllustratedMessage name={IllustrationMessageType.NoSearchResults} titleText="No existen resultados" subtitleText='Intente modificar los criterios de busqueda'/>
        
      }else {
        return <SAPTableComponent id="contentData" data={dataTable} column={column} handleSelectionChange={handleSelection}/>
      }
    }
    else {
      return <IllustratedMessage name={IllustrationMessageType.SimpleMagnifier} titleText="Obtengamos resultados" subtitleText='Comience escogiendo un banco y una cuenta'/>
    }
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
      <FlexBox direction={FlexBoxDirection.Column} alignItems={FlexBoxAlignItems.Center} ><BusyIndicator active={biactivator}/></FlexBox>
      <div>
        <DynamicPage
          headerContent={<DynamicPageHeader><FlexBox wrap="Wrap"><FlexBox direction="Column"><FlexBox style={{height:'50px'}}><ComboBox id='cmbAccount' style={{width:'240px'}} placeholder='Escoger cuenta' disabled={accountSelector === true ? 'false' : 'true'} onChange={handleAccChange} waitForDefine>{accountData.map((acc,index) => <ComboBoxItem key={acc.AccNo} text={acc.AccountName} additionalText={acc.AccNo}/>)}</ComboBox></FlexBox><FlexBox direction={FlexBoxDirection.Column}><Label>Rango de fechas</Label><DateRangePicker id='drpFechasAP' onChange={handleFilter} formatPattern="yyyy-MM-dd" disabled={pageStatus === true ? 'false' : 'true'}/></FlexBox><CheckBox id="cbGenArch" text="Mostrar archivos generados" onChange={handleCheck} disabled={pageStatus === true ? 'false' : 'true'}/></FlexBox></FlexBox></DynamicPageHeader>}
 
          headerTitle={<DynamicPageTitle actions={<><a download={fileName} href={fileDownloadUrl} ref={e=>dofileDownload = e} hidden>download it</a><Button design='Emphasized' icon='capital-projects' onClick={openBankSelector}>Escoger Banco</Button><Button onClick={handleGenArch} design="Transparent" icon='document-text'>Generar Archivo</Button></>} header={<><Title>Pagos Masivos</Title><Badge icon={<Icon name='loan'/>} colorScheme={accountSelector === true ? "8" : "2"}>{bankPicked[1]}</Badge></>} subHeader={<FlexBox></FlexBox>}></DynamicPageTitle>}
        >
          <PageContent/>
        </DynamicPage>
      </div>
      <SelectDialog id='bankSelector' headerText='Bancos' onConfirm={handlePick} rememberSelections='true'>{bankOptions.options.map((item, index) => <StandardListItem key={item.code} id={item.code} description={item.code} image={require('../assets/bank_logos/' + item.logo)}>{item.name}</StandardListItem>)}</SelectDialog>
    </>
    
  )
}

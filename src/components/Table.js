import React, {useState} from 'react'
import { 
    Label,
    Table, TableCell, TableColumn, TableRow, TableGrowingMode, TableMode
   } from '@ui5/webcomponents-react';

export default function SAPTableComponent({data, column, selectedRowsFromChildToParent}) { 
  
  const [selectedRows, setSelectedRows]= useState([])

  function handleSelection(e){
    let selectedRowsArray = []
    let selectedRowslen = 0
   
    selectedRowslen=e.detail["selectedRows"].length
    for (let i = 0; i < selectedRowslen; i++) {
      selectedRowsArray.push(e.detail["selectedRows"][i]["childNodes"][0]["innerText"]);
    }

    setSelectedRows(selectedRowsArray)
  }

  selectedRowsFromChildToParent (selectedRows) 

  return (
    <>
        <Table columns={column.map((item, index) => (<><TableColumn><Label>{item.heading}</Label></TableColumn></>))} growing={TableGrowingMode.Scroll} mode={TableMode.MultiSelect} onSelectionChange={handleSelection}>
          {data.map((reg, index) => (<TableRow>
                                        {column.map((colitem, colindex) => (<TableCell>
                                                                              <Label>
                                                                                {colitem.value != 'PymDocAmnt' ? reg[colitem.value] : reg[colitem.value] + ' ' + reg['Currency']}
                                                                              </Label>
                                                                            </TableCell>))} 
                                      </TableRow>))} 
        
        </Table> 
    </>
  )
  
}




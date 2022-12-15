import React, {useState} from 'react'
import { 
    Label,
    Table, TableCell, TableColumn, TableRow, TableGrowingMode, TableMode
   } from '@ui5/webcomponents-react';

export default function SAPTableComponent({id, data, column, handleSelectionChange}) { 

  return (
    <>
        <Table id={id} columns={column.map((item, index) => (<><TableColumn key={index}><Label>{item.heading}</Label></TableColumn></>))} growing={TableGrowingMode.Scroll} mode={TableMode.MultiSelect} onSelectionChange={handleSelectionChange}>
          {data.map((reg, index) => (<TableRow key={index}>
                                        {column.map((colitem, colindex) => (<TableCell key={''+index + colindex}>
                                                                              <Label>
                                                                                {colitem.value !== 'PymDocAmnt' ? reg[colitem.value] : reg[colitem.value] + ' ' + reg['Currency']}
                                                                              </Label>
                                                                            </TableCell>))} 
                                      </TableRow>))} 
        
        </Table> 
    </>
  )
  
}




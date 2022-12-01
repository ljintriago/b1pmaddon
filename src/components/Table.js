import React from 'react'
import { 
    Label,
    Table, TableCell, TableColumn, TableRow
   } from '@ui5/webcomponents-react';

export default function SAPTableComponent({data, column}) { 
    

  return (
    <>
        <Table columns={column.map((item, index) => (<><TableColumn><Label>{item.heading}</Label></TableColumn></>))}>          
            {data.map((item, column) => (<TableRow>{column.map((colitem, index) => (<TableCell><Label>{item[colitem.value]}</Label></TableCell>))}</TableRow>))}
        </Table> 
    </>
  )
  
}


//{data.map((item, index) => <TRow item={item} columns={columns}/>)}

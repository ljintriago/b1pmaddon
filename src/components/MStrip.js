import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef, createElement } from 'react'
import {MessageStrip} from '@ui5/webcomponents-react';


const MStrip = forwardRef((props, ref) => {
    let mStripId
    const [msgState,setMsgState] = useState(false)
    //const divRef = useRef()
    //const msgref = useRef()


    useImperativeHandle(ref, () => {
        return{
            createMS(id,text,type){
                mStripId = id
                const container = document.getElementById("wrapper")
                const messageStrip = document.getElementById(mStripId)

                if (messageStrip) {
                    container.removeChild(messageStrip);
                }

                 let generatedMessage = document.createElement("ui5-message-strip")
                generatedMessage.id = id
                generatedMessage.textContent = text
                generatedMessage.design = type

                generatedMessage.addEventListener('close', function handleRemove(event) {
                    const container = document.getElementById("wrapper")
                    const messageStrip = document.getElementById("msgError")
                    container.removeChild(messageStrip);
                    setMsgState(false)
                })
                
                container.appendChild(generatedMessage)

                
                setMsgState(true)
            }
        }
    })

    useEffect(() => {
        if(msgState){
            const msgTimer = setTimeout(() => {
                removeMS()
            },10000)
            return () => clearTimeout(msgTimer)
        }
    },[msgState])

    function removeMS(e) {
        const container = document.getElementById("wrapper")
        const messageStrip = document.getElementById("msgError")
        container.removeChild(messageStrip);
        setMsgState(false)
    }


  return (
    
    <div  id="wrapper">
       <MessageStrip hidden></MessageStrip>
    </div>
    
  )
}) 

export default MStrip

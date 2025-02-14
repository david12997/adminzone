'use client'

import { JSX, useState  } from "react"
import SectionItems from "@/components/section.movements/items/items"
import SectionAppMovement from "@/components/section.movements/app/app"
import ReduxProvider from "@/store/redux.provider"


type propsSectionMovement = {

    items:any[]
}

export const SectionNewMovement   = (props:propsSectionMovement):JSX.Element => {

    const [itemsDisplay, setItemsDisplay] = useState('block')
    const [appDisplay, setAppDisplay] = useState('block')
  

    return <ReduxProvider>

        <div className="absolute md:hidden z-[999] top-[49px] flex justify-center w-[80%]">
            <button onClick={()=> itemsDisplay === 'none' ? setItemsDisplay('block'):setItemsDisplay('none')} className="w-[130px] h-[30px] rounded-sm bg-[#4A0083] text-white text-[13px] m-1">Items</button>
            <button onClick={()=> appDisplay === 'none' ? setAppDisplay('block'):setAppDisplay('none')}className="w-[130px] h-[30px] rounded-sm bg-[#4A0083] text-white text-[13px] m-1">Movimientos</button>
            
        </div>

        
        <SectionItems itemsDisplay={itemsDisplay} items={props.items}/>
        <SectionAppMovement appDisplay={appDisplay}/>
       
    
    
    </ReduxProvider>
}
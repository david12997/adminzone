'use client'

import ReduxProvider from "@/store/redux.provider"
import { SectionNewMovement } from "./section.movements"


export default function SectionNewMovementWrapper(){

    return<ReduxProvider>        
        <SectionNewMovement/>
    </ReduxProvider>
}
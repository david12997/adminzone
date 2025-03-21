'use client'

import ReduxProvider from "@/store/redux.provider";
import { JSX } from "react"
import { Metrics } from "./metrics";

export const SectionMetrics = (): JSX.Element => { 

  return <ReduxProvider>
   
    <Metrics/>
  </ReduxProvider>;
};
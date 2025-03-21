'use client'
import { MetricsService } from "@/services/metrics.service";
import { useAppDispatch } from "@/store";
import { JSX, useEffect } from "react"

export const Metrics = (): JSX.Element => {

    const dispatch = useAppDispatch();

    useEffect(()=>{
        const myMetrics = new MetricsService();
        myMetrics.setMetrics(dispatch);
        
    }
    ,[]);

    return  <section className="ml-[66px] md:ml-[120px] mt-[45px] w-[80%] md:w-[90%] h-[90%] border border-black"> 

    </section>;
}
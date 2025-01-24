"use client"

import { JSX, useState } from "react"
import { IconFilter, IconSearch } from "./icons"


export const SectionNewMovement   = ():JSX.Element => {

    const [typeMovement, setTypeMovement] = useState<string>('entrada')

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTypeMovement(event.target.value.trim())
    }
    return <>
    
    <section className="w-[90%] md:w-[40%] bg-white p-4 rounded-md shadow-md h-[80vh]">
            <div className="container-titles border border-orange-300 w-[95%] ml-[2%] h-[13%] ">
                <div className="text-type relative flex items-center justify-center mt-4 cursor-pointer">
                    <p className="text absolute top-[-13px]  text-[13px] text-[#868686]">Tipo de movimiento</p>
                    <select
                        value={typeMovement}
                        onChange={handleChange}
                        style={{ color: typeMovement === 'entrada' ? '#0B8700' : '#E20000' }}
                        className="input-reset font-extrabold text-[20px] md:text-[24px] bg-white cursor-pointer"
                    >
                        <option className="text-[#0B8700] font-extrabold text-[17px] md:text-[20px]" value="entrada">Nueva Entrada</option>
                        <option className="text-[#E20000] font-extrabold text-[17px] md:text-[20px]" value="salida">Nueva Salida</option>
                    </select>
                </div>
            </div>
            <div className="container-actions border border-red-300 w-[95%] ml-[2%] h-[17%] flex justify-between items-center">
                <div className="contianer-input relative  w-[85%] cursor-pointer">
                    <div className="icon-search absolute left-[86%] top-[6px] ">
                        <IconSearch />
                    </div>
                    <input className="input-reset w-[99%] h-[50px] bg-[#E7E7E7] p-4 rounded-md font-bold" type="text" placeholder="Buscar item" />
                </div>

                <div className="container-filters cursor-pointer">
                    <IconFilter/>
                </div>
            </div>
        </section>
    
    
    </>
}
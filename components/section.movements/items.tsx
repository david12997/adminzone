'use client'

import { JSX, useEffect, useState } from "react"
import { IconFilter, IconSearch } from "../icons"
import { NewRequests } from "@/helpers/request"
import { FormatCurrency } from  "@/helpers/format.currency"

const SectionItems = ():JSX.Element => {

    const [typeMovement, setTypeMovement] = useState<string>('entrada');
    const [products, setProducts] = useState<any[]>([]);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTypeMovement(event.target.value.trim())
    }


    useEffect(() => {

        NewRequests(['http://localhost:3000/api/products?limit=50&offset=0']).then((response) => {

            setProducts(response[0].data)
            console.log(response)
        
        }).catch((error) => {
            console.log(error)

        })

       
        
    }
    ,[])

    return<>
        <section className="w-[90%] md:w-[48%]  bg-white p-4 rounded-md shadow-md h-[80vh] ">
                <div className="container-titlew-[95%] ml-[2%] h-[8%] ">
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
                <div className="container-actions  w-[95%] ml-[2%] h-[17%] flex justify-between items-center">
                    <div className="contianer-input relative  w-[85%] cursor-pointer">
                        <div className="icon-search absolute left-[76%] md:left-[85%] top-[6px] ">
                            <IconSearch />
                        </div>
                        <input className="input-reset w-[99%] h-[50px] bg-[#E7E7E7] p-4 rounded-md font-bold" type="text" placeholder="Buscar item" />
                    </div>
    
                    <div className="container-filters cursor-pointer">
                        <IconFilter/>
                    </div>
                </div>
                <div className="container-products flex flex-wrap justify-between w-[95%] ml-[2%] h-[66%]  overflow-y-scroll">
    
                    {
                        products.map((product) => {
                            
                            const media= JSON.parse(product.media) 
    
                            return <div key={product.id} className="card-product min-w-[130px] max-w-[140px] h-[250px] bg-white border border-[#a8a8a8e7] shadow-md m-2 p-1 rounded-md">
                                <div className="container-image w-[100%] h-[50%] ">
                                    <img className="w-full h-full object-contain" src={media.url} alt={product.name} />
                                </div>
                                <hr className="mt-2 mb-2"></hr>
                                <div className="container-info w-[100%] h-[50%] p-2">
                                    <p className="text-[13px]  text-[#868686] w-[99%] truncate">{product.name}</p>
                                    <p className="text-[18px] font-bold text-[#000] w-[99%] truncate">{FormatCurrency(product.ml_price,'COP')}</p>
                                </div>
                            </div>
                        })
                    }
                  
    
                </div>
            </section>
    
    </>
}

export default SectionItems
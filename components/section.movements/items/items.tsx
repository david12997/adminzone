'use client'

import { JSX } from "react";
import SearchBar from "@/components/section.movements/items/search.items.bar";
import useItems from "@/hooks/use.items";
import CardItem from "@/components/section.movements/items/card.items";


const SectionItems = (props:{itemsDisplay:string,items:any[]}): JSX.Element => {

    const {  itemsStore, typeMovement, handleChange, handleAddProduct, handlePriceChange } = useItems({items:props.items});


    return (
        <section style={{display:props.itemsDisplay }} className="w-[100%] md:w-[48%] bg-white p-4 rounded-md shadow-md h-[80vh] relative mt-2 md:mt-0">

            <div className="container-title w-[95%] ml-[2%] h-[8%]">
                <div className="text-type relative flex items-center justify-center mt-4 cursor-pointer">
                    <p className="text absolute top-[-13px] text-[13px] text-[#868686]">Tipo de movimiento</p>
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

            <SearchBar />

            <div className="container-products flex flex-wrap justify-between w-[95%] ml-[2%] h-[69%] overflow-y-scroll">
                {
                
                itemsStore.map((product:any) => {
                   
                   if(product.status === 'deleted' || product.name.toLowerCase().includes('legacy') ) return null;

                    return <CardItem 
                        key={product.id} 
                        product={product} 
                        media={JSON.parse(product.media)} 
                        handleAddProduct={handleAddProduct} 
                        handlePriceChange={handlePriceChange} 

                    />;
                })
                
                }
            </div>

        </section>
    );
};

export default SectionItems;

'use client'

import { FormatCurrency } from "@/helpers/format.currency";
import useApp from "@/hooks/use.app";
import { JSX } from "react";
import FormAppMovement from "@/components/section.movements/app/form.app";
import Loading from "@/components/loading";
import { IconGarbage } from "@/components/icons";

const SectionAppMovement = (props:{appDisplay:string}):JSX.Element => {

    const { movementProducts, owners, transaction, statusTransaction, ownersAccounts, handleTotalAmount,handleRemoveProduct,handleSetTransaction } = useApp();


    return<>

        <section style={{display:props.appDisplay}} className="w-[100%] md:w-[48%] bg-white p-4 rounded-md shadow-md h-[80vh] relative mt-2 md:mt-0">

            {
                statusTransaction === 'loading' 
                ?
                <Loading />
                :
                <>

                <div className="containerItems w-[95%] ml-[2%] h-[40%] bg-[#f3f3f3] overflow-y-scroll">

                    {
                        movementProducts.length > 0 &&  movementProducts.map((product:any, index:number) => {

                            const total = parseInt(product.quantity_selected) * parseInt(product.price_selected)
                            const media= JSON.parse(product.media)

                            return<div key={index} className="card-item w-[96%] ml-[2%] h-[56px] bg-white border border-[#979797] mt-2 mb-2 rounded-md flex justify-around">
                        
                            <div className="img min-w-[36px] -w-[56px] h-[50px] ml-1 flex justify-center items-center">
                                <img src={media.url} alt={product.name}  className="h-[100%] object-contain rounded-md "/>
                            </div>
        
                            <div className="data w-[30%] md:w-[50%] h-[100%] ml-4">
                                
                                <p className="name font-normal text-[13px] max-w-[200px] md:max-w-[350px] truncate text-[#5a5a5a]">{product.name}</p>
                                <p className="price font-bold max-w-[200px] md:max-w-[450px] truncate">{FormatCurrency(total,'COP')}</p>
                            </div>

                            <div className="quantity-selected delete-btn w-[30%] flex justify-around items-center">
                                <p className="font-bold text-[16px] text-[#5a5a5a]">x{product.quantity_selected}</p>

                                <button
                                    onClick={() => handleRemoveProduct(product.id)}
                                    className="bg-[#4A0083] w-[30px] md:w-[60px] h-[30px] rounded-md input-reset flex items-center justify-center">
                                    <p className=" text-[13px] font-semibold text-white "><IconGarbage/></p>
                                </button>

                            </div>
        
        
                        </div>
                        })
                    }

                    
                </div>

                <hr />

                <FormAppMovement 
                    handleSetTransaction={handleSetTransaction}
                    movementProducts={movementProducts} 
                    owners={owners} 
                    transaction={transaction}
                    ownersAccounts={ownersAccounts} 
                    handleTotalAmount={handleTotalAmount} 
                />
            </>
                
            }



        </section>
    
    </>
}



export default SectionAppMovement;
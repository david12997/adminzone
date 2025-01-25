import { FormatCurrency } from "@/helpers/format.currency";
import { JSX } from "react";
import InputMovement from "./input.movement";

const SectionAppMovement = ():JSX.Element => {

    const fakeData = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]


    return<>

        <section className="w-[90%] md:w-[48%]  bg-white p-4 rounded-md shadow-md h-[80vh] ">

            <div className="containerItems border border-red-500 w-[95%] ml-[2%] h-[50%] bg-[#f3f3f3] overflow-y-scroll">

                {
                    fakeData.map((item, index) => {

                        return<div key={index} className="card-item w-[96%] ml-[2%] h-[56px] bg-white border border-[#979797] mt-2 mb-2 rounded-md flex">
                    
                        <div className="img w-[56px] h-[50px] ml-1 flex justify-center items-center">
                            <img src="https://http2.mlstatic.com/D_601478-MCO69518016936_052023-O.webp" alt="box" className="h-[100%] object-contain rounded-md "/>
                        </div>
    
                        <div className="data w-[80%] h-[100%] ml-4">
                            
                            <p className="name font-normal text-[13px] min-w-[260px] truncate text-[#5a5a5a]">Pipa de Vidrio con forrode goma</p>
                            <InputMovement value={25000} />
                        </div>
    
    
                    </div>
                    })
                }

                

                
            </div>

            <hr />

            <div className="containerData border border-green-500 w-[95%] ml-[2%] h-[50%] ">
                <div className="container-1 ml-[3%] mt-2 w-[94%] border border-blue-500 h-[50%] flex ">
                    
                    <div className="total w-[45%]">
                        <p className="text-[#5a5a5a] text-[13px] font-normal">Total Movimiento</p>
                        <p className="price font-bold">{FormatCurrency(25000,'COP')}</p>
                    </div>
                    
                    <div className="total w-[45%]">
                        <p className="text-[#5a5a5a] text-[13px] font-normal">Total Movimiento</p>
                        <p className="price font-bold">{FormatCurrency(25000,'COP')}</p>
                    </div>
                
                </div>

            </div>

        </section>
    
    </>
}



export default SectionAppMovement;
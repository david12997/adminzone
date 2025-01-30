'use client'

import { FormatCurrency } from "@/helpers/format.currency";
import { JSX } from "react";
import InputMovement from "./input.movement";
import { io } from "socket.io-client";
import { useEffect } from "react";

const SectionAppMovement = ():JSX.Element => {

    const fakeData = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]

    useEffect(() => {
        const socket = io('ws://localhost:3001');
        socket.on('connect', () => {
            console.log('Conexión establecida con el servidor', socket.id);
            socket.on('item', (data) => {
                console.log(data);         
            });

        });
    },[])



    return<>

        <section className="w-[90%] md:w-[48%]  bg-white p-4 rounded-md shadow-md h-[80vh] ">

            <div className="containerItems w-[95%] ml-[2%] h-[40%] bg-[#f3f3f3] overflow-y-scroll">

                {
                    fakeData.map((item, index) => {

                        return<div key={index} className="card-item w-[96%] ml-[2%] h-[56px] bg-white border border-[#979797] mt-2 mb-2 rounded-md flex">
                    
                        <div className="img w-[56px] h-[50px] ml-1 flex justify-center items-center">
                            <img src="https://http2.mlstatic.com/D_601478-MCO69518016936_052023-O.webp" alt="box" className="h-[100%] object-contain rounded-md "/>
                        </div>
    
                        <div className="data w-[80%] h-[100%] ml-4">
                            
                            <p className="name font-normal text-[13px] min-w-[260px] truncate text-[#5a5a5a]">Pipa de Vidrio con forrode goma</p>
                            <p className="price font-bold">{FormatCurrency(25000,'COP')}</p>
                        </div>
    
    
                    </div>
                    })
                }

                

                
            </div>

            <hr />

            <div className="containerData  w-[95%] ml-[2%] h-[60%] ">

                <div className="container-1 ml-[3%] mt-2 w-[94%]  h-[18%] flex justify-around">
                    
                    <div className="total w-[45%]">
                        <p className="text-[#5a5a5a] text-[13px] font-normal">Total Movimiento</p>
                        <p className="price font-bold">{FormatCurrency(25000,'COP')}</p>
                    </div>
                    
                    <div className="total w-[45%]">
                        <p className=" text-[#5a5a5a] text-[13px] font-normal">Propietario</p>
                        <select className="input-reset select-owner font-bold">
                            <option value="1">CRIZZO</option>
                            <option value="2">LUPITA</option>
                            <option value="3">DAVID</option>
                            <option value="4">ADMIN</option>
                        </select>
                    </div>
                
                </div>
                
                <hr />
                
                <div className="container-1 ml-[3%] mt-2 w-[94%]  h-[18%] flex justify-betweenp pl-3">
                    <div className="cuentas w-[45%]">
                        <p className=" text-[#5a5a5a] text-[13px] font-normal">Cuenta Bancaria</p>
                        <select className="input-reset select-owner font-bold">
                            <option value="1">BANCOLOMBIA ***0333</option>
                            <option value="2">NEQUI ***3927</option>
                            <option value="3">NU BANK ***3966</option>
                            
                        </select>
                    </div>
                </div>

                 <hr />
                
                <div className="container-1 ml-[3%] mt-2 w-[94%]  h-[25%] flex ">
                    <div className="descripcion w-[95%] ml-[2%]">
                        <p className=" text-[#5a5a5a] text-[13px] font-normal">Descripcion</p>
                        <textarea className="input-reset text-area font-bold w-[95%] !h-[70%] text-[13px]"></textarea>
                    </div>
                    
                   
                </div>

                <hr />

                <div className="container-1 ml-[3%] mt-2 w-[94%]  h-[25%] flex items-center">
                    
                    <button className="bg-[#4A0083] w-[96%] ml-[2%] h-[50px] rounded-md input-reset">
                        <p className=" text-[13px] font-bold text-white ">Agregar Movimiento</p>
                    </button>
                    
                   
                </div>

            </div>

        </section>
    
    </>
}



export default SectionAppMovement;
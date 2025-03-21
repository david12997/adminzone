'use client'

import { FormatCurrency } from "@/helpers/format.currency";
import { transactionTypes } from "@/store/transaction";
import { JSX } from "react";

type formAppMovementProps = {
    owners: any[];
    ownersAccounts: any[];
    handleTotalAmount: (products: any) => any;
    movementProducts: any[];
    handleSetTransaction: (transaction: any) => any;
    transaction: transactionTypes['current_transaction'];
}

const FormAppMovement = (props:formAppMovementProps): JSX.Element => {

    const CreateMovement = async(event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault(); // Prevent the form from reloading

    
        const formData = new FormData(event.currentTarget);
        const ownerId = formData.get("owner") as string;
        const accountId = formData.get("account") as string;
        const description = formData.get("description") as string;
    
        // Validation
        if (props.movementProducts.length === 0) {
            alert("Debe agregar productos al movimiento");
            return;
        }
    
        if (!ownerId) {
            alert("Debe seleccionar un propietario");
            return;
        }
    
        if (!accountId) {
            alert("Debe seleccionar una cuenta bancaria");
            return;
        }
    
        if (!description.trim()) {
            alert("Debe ingresar una descripción");
            return;
        }
    
        const products = props.movementProducts.map((product: any) => ({
            id_product: product.id,
        }));

        const data = props.movementProducts.map((product: any) => ({
            id_product: product.id,
            name: product.name,
            quantity: product.quantity_selected,
            price: product.price_selected,
        }));
    
        const transaction = {
            type_movement: "entrada",
            amount: props.handleTotalAmount(props.movementProducts),
            concept: description,
            account_id: accountId,
            user_id: ownerId,
            products: products,
            data_transaction: data,
        };
    
        props.handleSetTransaction(transaction);

    }


    return<>
        <form onSubmit={CreateMovement} className="containerData  w-[95%] ml-[2%] h-[60%] ">

            <div className="container-1 ml-[3%] mt-2 w-[94%]  h-[18%] flex justify-around">
                
                <div className="total w-[35%]">
                    <p className="text-[#5a5a5a] text-[13px] font-normal truncate">Total Movimiento</p>
                    <p className="price font-bold">{FormatCurrency(props.handleTotalAmount(props.movementProducts),'COP')}</p>
                </div>
                
                <div className="total w-[45%]">
                    <p className=" text-[#5a5a5a] text-[13px] font-normal">Propietario</p>
                    <select name="owner" className="input-reset select-owner font-bold">
                        {
                            props.owners.length > 0 && props.owners.map((owner:any) => {
                                return<option key={owner.id} value={owner.id}>{owner.name}</option>
                            })
                        }
                        
                    </select>
                </div>
            
            </div>
            
            <hr />
            
            <div className="container-1 ml-[3%] mt-2 w-[94%]  h-[18%] flex justify-betweenp pl-3">
                <div className="cuentas w-[45%]">
                    <p className=" text-[#5a5a5a] text-[13px] font-normal truncate">Cuenta Bancaria</p>
                    <select name="account" className="input-reset select-owner font-bold">
                        {
                            props.ownersAccounts.length > 0 && props.ownersAccounts.map((account:any) => {
                                return<option key={account.id} value={account.id}>{account.bank+" - "+account.account_number}</option>
                            })
                        }
                        
                    </select>
                </div>
            </div>

                <hr />
            
            <div className="container-1 ml-[3%] mt-2 w-[94%]  h-[25%] flex ">
                <div className="descripcion w-[95%] ml-[2%]">
                    <p className=" text-[#5a5a5a] text-[13px] font-normal">Descripcion</p>
                    <textarea name="description" className="input-reset text-area font-bold w-[95%] !h-[70%] text-[13px]"></textarea>
                </div>
                
                
            </div>

            <hr />

            <div className="container-1 ml-[3%] mt-2 w-[94%]  h-[25%] flex items-center">
                
                <button  className="bg-[#4A0083] w-[96%] ml-[2%] h-[50px] rounded-md input-reset text-[13px] font-bold text-white">
                    Agregar Movimiento
                </button>
                
                
            </div>

        </form>
    
    </>
}

export default FormAppMovement;
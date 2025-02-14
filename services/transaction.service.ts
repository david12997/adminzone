import { NewRequests } from "@/helpers/request";
import {  setProducts } from "@/store/movement";
import { setStatus,setTransaction, transactionTypes } from "@/store/transaction";

/**
 * Class to handlethe tranasactions
 * 
 * 
 * @class Transaction
 * @method CreateTransaction
 * @method SetTypeTransaction
 * 
 * 
*/

export class TransactionService{

    async CreateTransaction(transaction: transactionTypes['current_transaction'],dispatch:any){
        try {
            dispatch(setStatus("loading"));
            dispatch(setTransaction(transaction));

            NewRequests([process.env.NEXT_PUBLIC_PROD_API_URL+"/api/transactions"], "POST", [JSON.stringify(transaction)])
            .then((response) => {
                console.log("Transaction created:", response);
                dispatch(setStatus("success"));

                dispatch(setProducts([]));
                dispatch(setTransaction({
                    type_movement: "",
                    amount: 0,
                    concept: "",
                    account_id: "",
                    user_id: "",
                    products: [],
                    data_transaction: [],
                }));

            })
            .catch((error) => {
                console.log("Error creating transaction:", error);
                dispatch(setStatus("error"));
            })


        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }


    SetTypeTransaction(transaction:transactionTypes['current_transaction'],type:string,dispatch:any){
       
        const newTransaction = {...transaction};
        newTransaction.type_movement = type;
        dispatch(setTransaction(newTransaction));
        
    }

}


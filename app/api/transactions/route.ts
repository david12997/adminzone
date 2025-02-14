export const dynamic ='force-dynamic'
export const fetchCache ='force-no-store'

import {NextResponse } from 'next/server'
import {DB} from '@/db/config'

export async function POST(req: Request) {

    try{

        /**
         * @description create transaction
         * @param {string} type_movement - type of movement (entrada/salida)
         * @param {number} amount - amount of transaction
         * @param {string} concept - concept of transaction
         * @param {number} user_id - user id
         * @param {array} products - products of transaction
         * @param {number} account_id - account id
         * @param {object} data_transaction - data of transaction
         * 
         */
        const data = await req.json();
        const {type_movement,amount,concept,user_id,products, account_id,data_transaction} = data;
        const date_transaction = new Date().toISOString().split('T')[0];

        // date of creation
        const created_on = new Date().toISOString().replace('T', ' ').split('.')[0];

        // get token from headers
        const authToken = req.headers.get('Authorization');

        //validation of token
        if(authToken === null || authToken === undefined) return NextResponse.json({status:401,message:'unauthorized'});

        // extract token from bearer
        const token = authToken.split(' ')[1];

        // compare token with database
        const [rows]: any[] = await DB.query('SELECT * FROM directus_users WHERE token = ?',[token]);
        if(rows.length === 0) return NextResponse.json({status:401,message:'unauthorized'});


        // create transaction
        const [result]: any = await DB.query('INSERT INTO transaction(id,status,owner,created_on,description,type,amount,data,transaction_account,date_transaction) VALUES(NULL,?,?,?,?,?,?,?,?,?)',["published",1,created_on,concept,type_movement,amount,JSON.stringify(data_transaction),account_id,date_transaction]);

        // get transaction id
        const transaction_id = result.insertId;

        // create relation beteween transaction and products
        products.map(async(product:any)=>{

            await DB.query('INSERT INTO transaction_product(id,transaction_id,product_id) VALUES(NULL,?,?)',[transaction_id,product.id_product]);

        });

        // create relation between transaction and user
        await DB.query('INSERT INTO transaction_owner(id,transaction_id,owner_id) VALUES(NULL,?,?)',[transaction_id,user_id]);

        return NextResponse.json({status:200,data:{transaction_id:transaction_id,message:'transaction created'}});

    }catch{

        return NextResponse.json({status:500,message:'internal server error'});
    }
}
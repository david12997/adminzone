export const dynamic ='force-dynamic'
export const fetchCache ='force-no-store'

import {NextResponse } from 'next/server'
import {DB} from '@/db/config'



export async function POST(req: Request, { params }: { params: Promise<{ id: any }> }){

    try{

        /**
         * @description get product by id
         * @method POST
         * @url /api/products/[id]
         * @example /api/products/1
         * @param id product id
         * @authToken token from header 
         * 
         */
        const id =(await params).id
        const authToken = req.headers.get('Authorization');

        //validtion id
         if(id === null || id === undefined) return NextResponse.json({status:400,message:'id reference not found'});

        //validation of token
        if(authToken === null || authToken === undefined) return NextResponse.json({status:401,message:'unauthorized'});

        // extract token from bearer
        const token = authToken.split(' ')[1];

        // compare token with database
        const [rows]: any[] = await DB.query('SELECT * FROM directus_users WHERE token = ?',[token]);
        if(rows.length === 0) return NextResponse.json({status:401,message:'unauthorized'});

        // get product
        const [product] = await DB.query('SELECT * FROM product WHERE id = ?',[id]);


        return NextResponse.json({status:200,data:product});

    }catch{

        return NextResponse.json({status:500,message:'internal server error'});
    }
}
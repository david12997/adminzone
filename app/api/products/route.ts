export const dynamic ='force-dynamic'
export const fetchCache ='force-no-store'

import {NextResponse } from 'next/server'
import {DB} from '@/db/config'

export async function POST(req: Request, res: Response) {

    try{

        const limit = new URL(req.url).searchParams.get('limit'); 
        const offset = new URL(req.url).searchParams.get('offset');

        const authToken = req.headers.get('Authorization');

        //validation of limit and offset 
        if(limit === null || limit === undefined) return NextResponse.json({status:400,message:'limit reference not found'});
        if(offset === null || offset === undefined) return NextResponse.json({status:400,message:'pagination offset not found'});

        //validation of token
        if(authToken === null || authToken === undefined) return NextResponse.json({status:401,message:'unauthorized'});

        // extract token from bearer
        const token = authToken.split(' ')[1];

        // compare token with database
        const [rows]: any[] = await DB.query('SELECT * FROM directus_users WHERE token = ?',[token]);
        if(rows.length === 0) return NextResponse.json({status:401,message:'unauthorized'});

        // get products
        const [products] = await DB.query('SELECT * FROM product LIMIT ? OFFSET ?',[parseInt(limit),parseInt(offset)]);


        return NextResponse.json({status:200,data:products});

    }catch{

        return NextResponse.json({status:500,message:'internal server error'});
    }
}
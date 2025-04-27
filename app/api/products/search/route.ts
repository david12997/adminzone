export const dynamic ='force-dynamic'
export const fetchCache ='force-no-store'

import {NextResponse } from 'next/server'
import {DB} from '@/db/config'

export async function POST(req: Request) {

    try{

        /**
         * @search  contain the pattern to search 
        */
        const data = await req.json();
        const {search} = data;

        /**
         * @limit  contain the number of items to show
         * @offset contain the number of items to skip
         */
        const limit = new URL(req.url).searchParams.get('limit'); 
        const offset = new URL(req.url).searchParams.get('offset');
        
        /**
         * @authToken contain the token of the user to authorize the request
         */
        const authToken = req.headers.get('Authorization');

        //validation of token
        if(authToken === null || authToken === undefined) return NextResponse.json({status:401,message:'unauthorized'});

        //validation of limit and offset 
        if(limit === null || limit === undefined) return NextResponse.json({status:400,message:'limit reference not found'});
        if(offset === null || offset === undefined) return NextResponse.json({status:400,message:'pagination offset not found'});
        

        

        // extract token from bearer
        const token = authToken.split(' ')[1];

        // compare token with database
        const [rows]: any[] = await DB.query('SELECT * FROM directus_users WHERE token = ?',[token]);
        if(rows.length === 0) return NextResponse.json({status:401,message:'unauthorized'});

        // Add wildcard for LIKE
        const searchPattern = `%${search}%`;

        // get products
        const [products] = await DB.query('SELECT id, name, description, stock, base, media, ml_price, unit_price, combo_price, mayor_price, comes_from, id_comes_from  FROM product WHERE name LIKE ?  LIMIT ? OFFSET ?',[searchPattern,parseInt(limit),parseInt(offset)]);


        return NextResponse.json({status:200,data:products});

    }catch{

        return NextResponse.json({status:500,message:'internal server error'});
    }
    
}

// url : http://localhost:3006/api/products/search?limit=50&offset=0
export const NewRequests = async(urls:string[],method:string,body?:string[],auth?:string) =>{

    try{


        const promises:any[] = [];

        urls.forEach((url:string, index:number)=>{
            
            promises[index] = fetch(url, method === 'GET' ? {
                method: method,
                cache: 'no-store',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': auth || `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`
                }
                
             }:{
                method: method,
                cache: 'no-store',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': auth || `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`
                },
                body: body ? body[index] || JSON.stringify({limit:10,offset:0}) : JSON.stringify({limit:10,offset:0})
             })           
        
        });

        const response = await Promise.all(promises);
        return await Promise.all(response.map(res=>res.json()))
    
        
    
    } catch (error) {  
        
        throw error;
    }
    
}
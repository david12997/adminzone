export const NewRequests = async(urls:string[]) =>{

    try{


        const promises:any[] = [];

        urls.forEach((url:string, index:number)=>{
            
            promises[index] = fetch(url,{
                method: 'POST',
                cache: 'no-store',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer JGQPC3fuRgXCtpNjShZQGnzC`
                },
                body: JSON.stringify({limit:10,offset:0})
            })           
        
        });

        const response = await Promise.all(promises);
        return await Promise.all(response.map(res=>res.json()))
    
        
    
    } catch (error) {  
        
        throw error;
    }
    
}
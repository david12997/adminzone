

import { SectionNewMovement } from "@/components/section.movements/section.movements";
import { NewRequests } from "@/helpers/request";


export default async function Movimientos() {

  const data = await NewRequests([ process.env.NEXT_PUBLIC_PROD_API_URL+'/api/products?limit=50&offset=0'], 'POST')
  const items = data[0].data;
  
  return (
    <> 
      <section className=" w-[80%] md:w-[85%] h-[86vh] ml-[64px] md:ml-[150px] mt-[80px] md:mt-[60px] flex justify-around flex-wrap overflow-y-scroll m-2 p-2 items-center">
        <SectionNewMovement items={items} />
      </section>

    </>
  );

}
  
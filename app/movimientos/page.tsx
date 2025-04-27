export const dynamic ='force-dynamic'
export const fetchCache ='force-no-store'

import { IconMovimientosList } from "@/components/icons.client";
import OpenQRScanner from "@/components/section.movements/link.qr";
import { SectionNewMovement } from "@/components/section.movements/section.movements";
import { NewRequests } from "@/helpers/request";
import Link from "next/link";



export default async function Movimientos() {

  const data = await NewRequests([ process.env.NEXT_PUBLIC_PROD_API_URL+'/api/products?limit=100&offset=0'], 'POST')
  const items = data[0].data;


  
  return (
    <> 
      <section className=" w-[80%] md:w-[85%] h-[86vh] ml-[64px] md:ml-[150px] mt-[80px] md:mt-[60px] flex justify-around flex-wrap overflow-y-scroll m-2 p-2 items-center">
        <Link href={'/movimientos/transacciones'} className="absolute cursor-pointer font-semibold w-[180px] h-[40px] z-50 bg-[#E20000] top-[20px] right-[90px] text-white text-center flex justify-center items-center rounded-md">
          <span className="mr-2">Ver Movimientos</span> <IconMovimientosList />
        </Link>
        <OpenQRScanner url={process.env.NEXT_PUBLIC_PROD_API_URL+'/qr-scanner'} />
        <SectionNewMovement items={items} />
      </section>

    </>
  );

}
  

import NavBar from "@/components/navbar";
import { dataPages } from "../data";
import NavigationPath from "@/components/navigation.path";
 import SectionNewMovementWrapper from "@/components/section.movements/section.movements.wrapper";


export default function Movimientos() {
    return (
      <> 
        <NavBar pages={dataPages.pages} />  
        <NavigationPath currentPage='Movimientos' />   
        <section className="border border-black w-[80%] md:w-[85%] h-[86vh] ml-[64px] md:ml-[150px] mt-[80px] md:mt-[75px] flex justify-around flex-wrap overflow-y-scroll m-2 p-2 items-center">
  
            <SectionNewMovementWrapper />
        </section>
  
      </>
    );
  }
  
import Link from "next/link"
import { JSX } from "react"

type NavBarProps = {

    pages:{
        name:string,
        icon:JSX.Element | any
        link?:string
    }[]

}
const NavBar:React.FC<NavBarProps> = (props) => {


    return<>
    
        <nav className="w-[60px] md:w-[100px] bg-white h-[100%] fixed top-0 left-0 z-50  shadow-md">

           <div className="main-container flex flex-col items-center justify-between h-[80%] mt-[10vh] ">

                {
                    props.pages.map((page,index) => {

                        return<div key={index} className="w-[100%]  flex items-center justify-center">
                            {
                                page.name === 'Movimientos'
                                ?
                                <Link href={"/"+page.name.toLowerCase()} className="flex flex-col items-center justify-center    w-[85%] h-[90px] ">
                    
                                    {page.icon()}
                                    <p className="hidden md:block text-[12px] text-[#4A0083] font-bold">{page.name}</p>
                                </Link>
                                :
                                <Link href={"/"+page.name.toLowerCase()}  className="flex flex-col items-center justify-center    w-[85%] h-[90px] ">
                    
                                    {page.icon()}
                                    <p className="hidden md:block text-[12px] text-[#9B9B9B] font-bold">{page.name}</p>
                                </Link>
                            }
                            
                        </div>
                    })
                }

              

           </div>
        </nav>
    </>

}

export default NavBar
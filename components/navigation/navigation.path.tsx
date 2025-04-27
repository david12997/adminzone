'use client'
import { usePathname } from "next/navigation"
import { IconArrowLeft } from "../icons"
import { useRouter } from "next/navigation"


const NavigationPath:React.FC = () => {

    const pathname = usePathname()
    const router = useRouter()

    return<>

        <section className="width-[80%] fixed top-[20px] left-[80px] md:left-[130px] flex text-[#868686] items-center font-bold cursor-pointer">
            <div onClick={()=>router.back()} className="icon">
                <IconArrowLeft />
            </div>
            <p className="ml-2 md:ml-4 text-[14px] md:text-[15px]"> {pathname} </p>
        </section>
    </>
}

export default NavigationPath
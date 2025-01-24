
import { IconArrowLeft } from "./icons"

type navigationProps = {
    currentPage:string
}

const NavigationPath:React.FC<navigationProps> = (props) => {

    return<>

        <section className="width-[80%] fixed top-[20px] left-[80px] md:left-[130px] flex text-[#868686] items-center font-bold cursor-pointer">
            <div className="icon">
                <IconArrowLeft />
            </div>
            <p className="ml-2 md:ml-4 text-[14px] md:text-[15px]">  {props.currentPage}</p>
        </section>
    </>
}

export default NavigationPath
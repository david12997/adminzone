import { IconGarbage } from "@/components/icons";
import { FormatCurrency } from "@/helpers/format.currency";


type cardAppProps = {
    index: number;
    media: any;
    product: any;
    total: number;
    handleRemoveProduct: (id: any) => void;
}

const CardApp:React.FC<cardAppProps> = ({index,media,product,total,handleRemoveProduct}) => {

    return<>
        <div key={index} className="card-item w-[96%] ml-[2%] h-[56px] bg-white border border-[#979797] mt-2 mb-2 rounded-md flex justify-around">
                                
            <div className="img min-w-[36px] -w-[56px] h-[50px] ml-1 flex justify-center items-center">
                <img src={media.url} alt={product.name}  className="h-[100%] object-contain rounded-md "/>
            </div>

            <div className="data w-[30%] md:w-[50%] h-[100%] ml-4">
                
                <p className="name font-normal text-[13px] max-w-[200px] md:max-w-[350px] truncate text-[#5a5a5a]">{product.name}</p>
                <p className="price font-bold max-w-[200px] md:max-w-[450px] truncate">{FormatCurrency(total,'COP')}</p>
            </div>

            <div className="quantity-selected delete-btn w-[30%] flex justify-around items-center">
                <p className="font-bold text-[16px] text-[#5a5a5a]">x{product.quantity_selected}</p>

                <button
                    onClick={() => handleRemoveProduct(product.id)}
                    className="bg-[#4A0083] w-[30px] md:w-[60px] h-[30px] rounded-md input-reset flex items-center justify-center">
                    <p className=" text-[13px] font-semibold text-white "><IconGarbage/></p>
                </button>

            </div>


        </div>
    
    </>
}

export default CardApp;
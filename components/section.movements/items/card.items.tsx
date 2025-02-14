import { FormatCurrency } from "@/helpers/format.currency";

type CardItemProps = {
    product: any;
    media: any;
    handleAddProduct: any;
    handlePriceChange: any;
}

const CardItem: React.FC<CardItemProps> = ({ product,media,handleAddProduct, handlePriceChange  }) => {


    return<>
        <div key={product.id} className="card-product min-w-[130px] max-w-[140px] h-[250px] bg-white border-2 border-[#cececee7] shadow-md m-2 p-1 rounded-md">
            <div className="container-image w-[100%] h-[35%]">
                <img className="w-full h-full object-contain" src={media.url} alt={product.name} />
            </div>
            <hr className="mt-1 mb-2" />
            <div className="container-info w-[100%] h-[65%] p-2">
                <p className="text-[13px] text-[#868686] w-[99%] truncate mb-4">{product.name}</p>
                <hr className="mt-1 mb-2" />
                <p className="text-[13px] text-[#868686] w-[99%] truncate">Elegir Precio:</p>
                <select
                    defaultValue={product.unit_price}
                    className="text-[13px] font-bold text-[#000] w-[99%] truncate input-reset"
                    onChange={(e) => handlePriceChange(product.id, e.target.value)}
                >
                    <option value={product.unit_price}>Unidad: {FormatCurrency(product.unit_price, 'COP')}</option>
                    <option value={product.combo_price}>Combo: {FormatCurrency(product.combo_price, 'COP')}</option>
                    <option value={product.mayor_price}>Al Mayor: {FormatCurrency(product.mayor_price, 'COP')}</option>
                </select>
                <button onClick={() => handleAddProduct(product)} className="bg-[#4A0083] text-[#fff] font-bold text-[13px] w-[99%] h-[30px] rounded-md mt-2">Agregar</button>
            </div>
        </div>
    
    </>
}


export default CardItem;
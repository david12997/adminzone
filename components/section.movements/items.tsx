'use client'

import { JSX, useEffect, useRef, useState } from "react";
import { IconFilter, IconSearch } from "../icons";
import { NewRequests } from "@/helpers/request";
import { FormatCurrency } from "@/helpers/format.currency";

import { useAppDispatch, useAppSelector } from "@/store";
import { setProducts } from "@/store/movement";
import { setItems } from "@/store/item";

type Product = {
    id: string;
    name: string;
    media: string;
    unit_price: number;
    combo_price: number;
    mayor_price: number;
};

const SectionItems = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const movementProducts = useAppSelector((state) => state.movement.products);
    
    const [typeMovement, setTypeMovement] = useState<'entrada' | 'salida'>('entrada');
    const [products, setProductsList] = useState<Product[]>([]);
    const [priceSelected, setPriceSelected] = useState<{ [key: string]: string }>({});

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTypeMovement(event.target.value as 'entrada' | 'salida');
    };

    const handleAddProduct = (product: Product) => {
        const selectedPrice = priceSelected[product.id] || product.unit_price;
        const productIndex = movementProducts.findIndex((item) => item.id === product.id);

        if (productIndex !== -1) {
            const newProducts = [...movementProducts];
            newProducts[productIndex] = {
                ...newProducts[productIndex],
                quantity_selected: newProducts[productIndex].quantity_selected + 1,
                price_selected: selectedPrice,
            };
            dispatch(setProducts(newProducts));
        } else {
            dispatch(setProducts([...movementProducts, { ...product, quantity_selected: 1, price_selected: selectedPrice }]));
        }
    };

    const handlePriceChange = (productId: string, price: string) => {
        setPriceSelected((prev) => ({ ...prev, [productId]: price }));
    };

    useEffect(() => {
        dispatch(setItems([]));
        
        NewRequests(['http://localhost:3000/api/products?limit=50&offset=0'])
            .then((response) => {
                setProductsList(response[0].data);
                dispatch(setItems(response[0].data));
            })
            .catch(console.log);
    }, [dispatch]);

    return (
        <section className="w-[90%] md:w-[48%] bg-white p-4 rounded-md shadow-md h-[80vh]">
            <div className="container-title w-[95%] ml-[2%] h-[8%]">
                <div className="text-type relative flex items-center justify-center mt-4 cursor-pointer">
                    <p className="text absolute top-[-13px] text-[13px] text-[#868686]">Tipo de movimiento</p>
                    <select
                        value={typeMovement}
                        onChange={handleChange}
                        style={{ color: typeMovement === 'entrada' ? '#0B8700' : '#E20000' }}
                        className="input-reset font-extrabold text-[20px] md:text-[24px] bg-white cursor-pointer"
                    >
                        <option className="text-[#0B8700] font-extrabold text-[17px] md:text-[20px]" value="entrada">Nueva Entrada</option>
                        <option className="text-[#E20000] font-extrabold text-[17px] md:text-[20px]" value="salida">Nueva Salida</option>
                    </select>
                </div>
            </div>
            <div className="container-products flex flex-wrap justify-between w-[95%] ml-[2%] h-[66%] overflow-y-scroll">
                {products.map((product) => {
                    const media = JSON.parse(product.media);
                    return (
                        <div key={product.id} className="card-product min-w-[130px] max-w-[140px] h-[250px] bg-white border border-[#979797e7] shadow-md m-2 p-1 rounded-md">
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
                    );
                })}
            </div>
        </section>
    );
};

export default SectionItems;

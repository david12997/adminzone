
import { useEffect, useRef, useState, useCallback } from "react";
import { TransactionService } from "@/services/transaction.service";
import { useAppDispatch, useAppSelector } from "@/store";
import { setItems } from "@/store/item";
import { setProducts } from "@/store/movement";

// Define types
type Product = {
    id: string;
    name: string;
    media: string;
    unit_price: number;
    combo_price: number;
    mayor_price: number;
};

type Props = {
    items: Product[];
};


/**
 * 
 * @description Custom hook to manage items and apply udpates in the store
 */
const useItems = ({ items }: Props) => {
    
    const dispatch = useAppDispatch();
    
    // Selectors from store
    const movementProducts = useAppSelector(state => state.movement.products);
    const transaction = useAppSelector(state => state.transaction.current_transaction);
    const itemsStore = useAppSelector(state => state.item.items);

    // State
    const [typeMovement, setTypeMovement] = useState<"entrada" | "salida">("entrada");
    const [priceSelected, setPriceSelected] = useState<Record<string, string>>({});
    
    // Beep sound reference
    const beepSound = useRef<HTMLAudioElement | null>(null);


    // Handle transaction type change
    const handleChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = event.target.value as "entrada" | "salida";
        setTypeMovement(newType);
        new TransactionService().SetTypeTransaction(transaction, newType, dispatch);
    }, [transaction, dispatch]);


    // Add product to movement
    const handleAddProduct = useCallback((product: Product) => {
        const selectedPrice = priceSelected[product.id] || product.unit_price;
        const productIndex = movementProducts.findIndex(item => item.id === product.id);

        const updatedProducts = productIndex !== -1
            ? movementProducts.map((item, index) =>
                index === productIndex
                    ? { ...item, quantity_selected: item.quantity_selected + 1, price_selected: selectedPrice }
                    : item
            )
            : [...movementProducts, { ...product, quantity_selected: 1, price_selected: selectedPrice }];

        dispatch(setProducts(updatedProducts));
        beepSound.current?.play();
    }, [dispatch, movementProducts, priceSelected]);


    // Handle price change
    const handlePriceChange = useCallback((productId: string, price: string) => {
        setPriceSelected(prev => ({ ...prev, [productId]: price }));
    }, []);


    // Effect: Load items and beep sound
    useEffect(() => {
        beepSound.current = new Audio(process.env.NEXT_PUBLIC_BEEP_SOUND_URL);
        dispatch(setItems(items));
    }, [dispatch, items]);


    return {
        handleChange,
        handleAddProduct,
        handlePriceChange,
        itemsStore,
        typeMovement,
    };
};

export default useItems;

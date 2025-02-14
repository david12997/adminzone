import { useCallback, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

import { AccountService } from "@/services/account.service";
import { OwnerService } from "@/services/owner.service";
import { TransactionService } from "@/services/transaction.service";
import { useAppDispatch, useAppSelector } from "@/store";
import { setProducts } from "@/store/movement";



const useApp = () => {

  // Redux dispatch hook
  const dispatch = useAppDispatch();


  const movementProducts = useAppSelector((state) => state.movement.products);
  const owners = useAppSelector((state) => state.owners.owners);
  const ownersAccounts = useAppSelector((state) => state.owners.owners_accounts);
  const transaction = useAppSelector((state) => state.transaction.current_transaction);
  const statusTransaction = useAppSelector((state) => state.transaction.current_status);


  // Ref to store the latest movementProducts (avoids stale closures in socket events)
  const productsRef = useRef<any[]>(movementProducts);
  useEffect(() => {
    productsRef.current = movementProducts;
  }, [movementProducts]);



  /**
   * Adds a product to the movement.
   * If the product already exists, it updates its quantity and price.
   *
   * @param product - The product to add.
   */

  const handleAddProduct = useCallback((product: any) => {
    // Use the selected price if available; otherwise, fall back to unit_price
    const selectedPrice = product.price_selected ?? product.unit_price;

    // Find the product index in the current list
    const productIndex = productsRef.current.findIndex(
      (item) => item.id === product.id
    );

    let updatedProducts: any[];

    if (productIndex !== -1) {

      // Clone the current products array and update the existing product
      updatedProducts = [...productsRef.current];
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        quantity_selected: updatedProducts[productIndex].quantity_selected + 1,
        price_selected: selectedPrice,
      };
    } else {

      // Product not in the list; add it as a new entry
      updatedProducts = [...productsRef.current, { ...product }];
    }

    // Update the store with the new products array
    dispatch(setProducts(updatedProducts));

  }, [dispatch]);

  

  /**
   * Removes a product from the movement.
   * Decrements its quantity if more than one exists; otherwise, removes the product.
   *
   * @param productId - The ID of the product to remove.
   */
  const handleRemoveProduct = useCallback((productId: string | number) => {

    // Update each product: decrement quantity if it matches productId
    // Then filter out products with zero (or less) quantity
    const updatedProducts = productsRef.current
      .map((product) =>
        product.id === productId
          ? { ...product, quantity_selected: product.quantity_selected - 1 }
          : product
      )
      .filter((product) => product.quantity_selected > 0);

    dispatch(setProducts(updatedProducts));

  }, [dispatch]);


  /**
   * Calculates the total amount for an array of products.
   *
   * @param products - The list of products.
   * @returns The total calculated amount.
   */

  const handleTotalAmount = useCallback((products: any[]): number => {
    return products.reduce((total, product) => {

      // Multiply quantity by price (using price_selected if available)
      const productTotal = product.quantity_selected * (product.price_selected ?? product.unit_price);
      return total + productTotal;

    }, 0);
  }, []);



  /**
   * Sets a transaction in the store and sends it to the server.
   *
   * @param transactionData - The transaction data to set.
   */
  const handleSetTransaction = useCallback((transactionData: any) => {
    const transactionService = new TransactionService();
    transactionService.CreateTransaction(transactionData, dispatch);
  }, [dispatch]);

  
  // Side Effects

  useEffect(() => {

    // Establish a socket connection to the server
    const socket: Socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL);

    socket.on("connect", () => {
      console.log("Connected to socket server", socket.id);
    });

    // Listen for "item" events from the socket server
    socket.on("item", (data: any) => {
      console.log("Received item:", data, productsRef.current);
      handleAddProduct(data);
    });

    // Initialize owners and accounts using their respective services
    const ownerService = new OwnerService();
    ownerService.setOwners(dispatch);

    const accountService = new AccountService();
    accountService.setAccounts(dispatch);

    // Cleanup: disconnect the socket when the component unmounts
    return () => {
      socket.disconnect();
      
    };
  }, [dispatch, handleAddProduct]);


  return {
    movementProducts,
    owners,
    transaction,
    ownersAccounts,
    statusTransaction,
    handleAddProduct,
    handleRemoveProduct,
    handleTotalAmount,
    handleSetTransaction,
  };
};

export default useApp;
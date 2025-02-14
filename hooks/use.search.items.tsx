import { useAppDispatch } from "@/store";
import { setItems } from "@/store/item";
import { useState } from "react";

const useSearchIem = ()=>{

    const dispatch = useAppDispatch();
    const [search, setSearch] = useState("");

    const handleSearch = async (query: string) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/products/search?limit=50&offset=0`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer JGQPC3fuRgXCtpNjShZQGnzC`,
                    },
                    body: JSON.stringify({ search: query }),
                }
            );

            const result = await response.json();
            
            dispatch(setItems(result.data));
            console.log("Items:", result.data);
            
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim()) {
            handleSearch(search);
        }
    };

    return {search, setSearch, handleSearch, handleSubmit};
    
}

export default useSearchIem;
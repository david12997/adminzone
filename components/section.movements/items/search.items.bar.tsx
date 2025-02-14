'use client';

import { IconSearch, IconFilter } from "@/components/icons";
import useSearchIem from "@/hooks/use.search.items";

const SearchBar = () => {

    const { search, setSearch, handleSearch, handleSubmit } = useSearchIem();

    return (
        <div className="container-search-tools flex mt-2 mb-2">
            <form 
                onSubmit={handleSubmit} 
                className="relative container-search w-[90%] ml-[2%] h-[50px] flex items-center justify-between"
            >
                <input
                    type="text"
                    className="bg-[#e6e6e6] input-search w-[100%] h-[100%] p-2 rounded-md input-reset"
                    placeholder="Buscar Producto"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onBlur={(e) => search === "" && handleSearch(e.target.value)}
                />
                <button type="submit" className="absolute left-[69%] md:left-[85%]">
                    <IconSearch />
                </button>
            </form>

            <div className="container-filter w-[10%] ml-[2%] h-[8%] flex items-center justify-between">
                <div className="h-[50px] flex items-center justify-center">
                    <IconFilter />
                </div>
            </div>
        </div>
    );
};

export default SearchBar;


'use client'

import { FormatCurrency } from "@/helpers/format.currency";
import { JSX, useEffect, useRef, useState } from "react";

const mockData = [
  {
    owner: { name: "John Doe" },
    product: [{ name: "Product A" }, { name: "Product B" }],
    date: "2025-03-20",
    transaction: { account: "12345" },
    amount: 100,
    type: "entrada",
    description: "Payment received",
  },
  {
    owner: { name: "Jane Smith" },
    product: [{ name: "Product C" }],
    date: "2025-03-19",
    transaction: { account: "67890" },
    amount: 200,
    type: "salida",
    description: "Purchase made",
  },
  {
    owner: { name: "John Doe" },
    product: [{ name: "Product D" }],
    date: "2025-03-18",
    transaction: { account: "54321" },
    amount: 150,
    type: "entrada",
    description: "Additional payment",
  },
];

export const TransactionTable = (props: { transactionData: any }): JSX.Element => {
  const [data, setData] = useState(props.transactionData || mockData);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type: "",
    owner: "",
    transactionAccount: "",
  });
  const [hoveredProducts, setHoveredProducts] = useState<string[] | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [metricsVisible, setMetricsVisible] = useState(false);

  const refMetrics = useRef<HTMLDivElement | null>(null);
  const refFilters = useRef<HTMLDivElement | null>(null);

  const handleFilterChange = (field: string, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleUpdateTable = () => {
    console.log("Table data updated");
  };

  const handleMouseEnter = (products: string[], event: React.MouseEvent) => {
    setHoveredProducts(products);
    setPopupPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredProducts(null);
    setPopupPosition(null);
  };

  const filteredData = data.filter((item: any) => {
    const matchesStartDate = filters.startDate
      ? new Date(item.date) >= new Date(filters.startDate)
      : true;
    const matchesEndDate = filters.endDate
      ? new Date(item.date) <= new Date(filters.endDate)
      : true;
    const matchesType = filters.type
      ? item.type.toLowerCase().includes(filters.type.toLowerCase())
      : true;
    const matchesOwner = filters.owner
      ? item.owner.name.toLowerCase().includes(filters.owner.toLowerCase())
      : true;
    const matchesTransactionAccount = filters.transactionAccount
      ? item.transaction.account.includes(filters.transactionAccount)
      : true;

    return (
      matchesStartDate &&
      matchesEndDate &&
      matchesType &&
      matchesOwner &&
      matchesTransactionAccount
    );
  });

  // Ordenar las transacciones por fecha descendente
const sortedData = [...filteredData].sort((a: any, b: any) => {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
});

// Calculate totals by owner and type based on filtered data
const totalsByOwner: { [key: string]: number } = {};
const totalsByType: { [key: string]: number } = { entrada: 0, salida: 0 };

filteredData.forEach((item: any) => {
  // Total by owner
  if (!totalsByOwner[item.owner.name]) {
    totalsByOwner[item.owner.name] = 0;
  }
  totalsByOwner[item.owner.name] += parseFloat(item.amount); // Ensure amount is parsed as a number

  // Total by type
  const normalizedType = item.type.toLowerCase(); // Normalize type to lowercase
  if (normalizedType === "entrada" || normalizedType === "salida") {
    totalsByType[normalizedType] += parseFloat(item.amount); // Ensure amount is parsed as a number
  }
});


  useEffect(() => {
    const handleClickOutside = (ref: React.RefObject<HTMLDivElement | null>,type:string) => (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        if(type === 'metrics'){
          setMetricsVisible(false);
        }else{
          setFiltersVisible(false);
        }
      }
    };

    
    const metricsListener = handleClickOutside(refMetrics,'metrics');
    const filtersListener = handleClickOutside(refFilters,'filters');

    if (metricsVisible) {
      document.addEventListener("mousedown", metricsListener);
    }

    if (filtersVisible) {
      document.addEventListener("mousedown", filtersListener);
    }

    return () => {
      document.removeEventListener("mousedown", metricsListener);
      document.removeEventListener("mousedown", filtersListener);
    };
    
  }, [metricsVisible, filtersVisible]);

  return (
    <>
      <section className="w-[90%] md:w-[85%] h-[100%] flex flex-col overflow-y-scroll p-4 bg-white shadow-md rounded-md">
       
        {/* Header */}
        <div className="container-options mb-4  ">
          <button onClick={()=>setFiltersVisible(!filtersVisible)} className="p-2  bg-[#4A0083] text-white rounded w-full md:w-[150px] mr-2">
            Filtros
            </button>

            <button onClick={()=>setMetricsVisible(!metricsVisible)} className="p-2  bg-[#4A0083] text-white rounded w-full md:w-[150px] mr-2">
              Metricas
            </button>
            
            <button onClick={handleUpdateTable} className="p-2 bg-[#4A0083] text-white rounded w-full md:w-[150px]">
              Actualizar tabla
            </button>
        </div>
       {/* Filters */}
       <div className="conatiner-filters">
          
          
          {
            filtersVisible 
            &&
            <div ref={refFilters} className="flex flex-wrap gap-4 mb-6 absolute z-[99999] bg-white p-4 rounded-md shadow-2xl w-[82%] left-[160px] border border-[#bdbdbd] ">
              <div className="w-full md:w-[30%]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de inicio</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange("startDate", e.target.value)}
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>

              <div className="w-full md:w-[30%]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de corte</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange("endDate", e.target.value)}
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>

              <div className="w-full md:w-[30%]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Tipo</label>
                <input
                  type="text"
                  value={filters.type}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                  className="p-2 border border-gray-300 rounded w-full"
                  placeholder="entrada/salida"
                />
              </div>

              <div className="w-full md:w-[30%]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Propietario</label>
                <input
                  type="text"
                  value={filters.owner}
                  onChange={(e) => handleFilterChange("owner", e.target.value)}
                  className="p-2 border border-gray-300 rounded w-full"
                  placeholder="Ingresa el nombre"
                />
              </div>

              <div className="w-full md:w-[30%]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Cuenta</label>
                <input
                  type="text"
                  value={filters.transactionAccount}
                  onChange={(e) => handleFilterChange("transactionAccount", e.target.value)}
                  className="p-2 border border-gray-300 rounded w-full"
                  placeholder="Ingresa el numero de cuenta"
                />
              </div>
            </div>
          }
          
       </div>



        {/* Totals Section */}
        {
          metricsVisible
          &&
          <div ref={refMetrics} className="mt-12 p-4 absolute z-[99999] bg-white  rounded-md shadow-2xl w-[82%] left-[160px] border border-[#bdbdbd]">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-bold text-[18px]">Total por propietario :</h3>
                <ul>
                  {Object.entries(totalsByOwner).map(([owner, total]) => (
                    <li className="m-2 font-semibold text-[#686868]" key={owner}>
                      {owner}: {FormatCurrency(total, "COP")} COP
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-[18px]">Total por tipo :</h3>
                <ul>
                  <li className="m-2 font-semibold text-[#686868]">Entrada: {FormatCurrency(totalsByType.entrada, "COP")}</li>
                  <li className="m-2 font-semibold text-[#686868]">Salida: {FormatCurrency(totalsByType.salida, "COP")}</li>
                  {
                    (totalsByType.entrada - totalsByType.salida) > 0
                    ?
                    <li className="m-2 font-semibold text-[#1b8d25]">Balance E-S : {FormatCurrency(totalsByType.entrada - totalsByType.salida, "COP")}</li>
                    :
                    <li className="m-2 font-semibold text-[#cf1717] ">Balance E-S : {FormatCurrency(totalsByType.entrada - totalsByType.salida, "COP")}</li>
                  }
                  
                </ul>
              </div>
            </div>
          </div>
        }
        


        {/* Responsive Table */}
        <div className="">
          <table className="table-auto border-collapse border border-gray-300 w-full text-left">
            <thead>
              <tr className=" table-fixed">
              <th className="border border-gray-300 p-2 pt-4 scroll-pb-44">Tipo</th>
                <th className="border border-gray-300 p-2 pt-4 scroll-pb-44">Propietario</th>
                <th className="border border-gray-300 p-2 pt-4 scroll-pb-44">Productos</th>
                <th className="border border-gray-300 p-2 pt-4 scroll-pb-44">Fecha</th>
                <th className="border border-gray-300 p-2 pt-4 scroll-pb-44">Cuenta</th>
                <th className="border border-gray-300 p-2 pt-4 scroll-pb-44">Monto</th>
                
                <th className="border border-gray-300 p-2 pt-4 scroll-pb-44">Descripcion</th>
              </tr>
            </thead>
            <tbody  className="font-normal text-[#474747]">
              {sortedData.map((item: any, index: number) => (
                <tr  key={index} className="hover:bg-gray-50">
                  <td style={item.type === 'Entrada' ? {background:"#e9ffe4"} :{background:"#ffe4e4"}} className="border border-gray-300 pt-6 pb-6 p-2 ">{item.type}</td>
                  <td className="border border-gray-300 pt-6 pb-6 p-2">{item.owner.name}</td>
                  <td
                    className="border border-gray-300 pt-6 pb-6 p-2 relative"
                    onMouseEnter={(e) => handleMouseEnter(item.product.map((p: any) => p.name), e)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {item.product.length}
                  </td>
                  <td className="border border-gray-300 pt-6 pb-6 p-2">{item.date}</td>
                  <td className="border border-gray-300 pt-6 pb-6 p-2">
                    {item.transaction.account}
                  </td>
                  <td className="border border-gray-300 pt-6 pb-6 p-2">{FormatCurrency(parseInt(item.amount), "COP")}</td>
                  
                  <td className="border border-gray-300 pt-6 pb-6 p-2">{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        {filteredData.length === 0 && (
          <p className="text-center text-gray-500 mt-4">Resultados no encontrados.</p>
        )}
      </section>
      
       {/* Popup */}
       {hoveredProducts && popupPosition && (
        <div
          className="fixed bg-gray-800 text-white text-lg rounded-lg p-4 shadow-lg"
          style={{
            top: popupPosition.y + 10,
            left: popupPosition.x + 10,
            zIndex: 1000,
          }}
        >
          <h3 className="font-bold mb-2">Products:</h3>
          {hoveredProducts.map((name, i) => (
            <div key={i}>{name}</div>
          ))}
        </div>
      )}
    </>
  );
};
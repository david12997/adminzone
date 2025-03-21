'use client'

import { JSX, useState } from "react";

const mockData = [
  {
    owner: { name: "John Doe" },
    product: [{ name: "Product A" }, { name: "Product B" }],
    date: "2025-03-20",
    transaction: { account: "12345" },
    amount: 100,
    type: "Credit",
    description: "Payment received",
  },
  {
    owner: { name: "Jane Smith" },
    product: [{ name: "Product C" }],
    date: "2025-03-19",
    transaction: { account: "67890" },
    amount: 200,
    type: "Debit",
    description: "Purchase made",
  },
];

export const TransactionTable = (props:{transactionData:any}): JSX.Element => {
  const [data, setData] = useState( props.transactionData || mockData);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type: "",
    owner: "",
    transactionAccount: "",
  });
  const [hoveredProducts, setHoveredProducts] = useState<string[] | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);

  const handleFilterChange = (field: string, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleUpdateTable = () => {
    // Logic to update table data (e.g., fetch new data from an API)
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

  const filteredData = data.filter((item:any) => {
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

  return (
    <>
      <section className="w-[90%] md:w-[85%] h-[100%] flex flex-col overflow-y-scroll p-4 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Transaction Table</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange("startDate", e.target.value)}
            className="p-2 border border-gray-300 rounded w-full md:w-[30%]"
            placeholder="Start Date"
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange("endDate", e.target.value)}
            className="p-2 border border-gray-300 rounded w-full md:w-[30%]"
            placeholder="End Date"
          />
          <input
            type="text"
            value={filters.type}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            className="p-2 border border-gray-300 rounded w-full md:w-[30%]"
            placeholder="Filter by Type"
          />
          <input
            type="text"
            value={filters.owner}
            onChange={(e) => handleFilterChange("owner", e.target.value)}
            className="p-2 border border-gray-300 rounded w-full md:w-[30%]"
            placeholder="Filter by Owner"
          />
          <input
            type="text"
            value={filters.transactionAccount}
            onChange={(e) =>
              handleFilterChange("transactionAccount", e.target.value)
            }
            className="p-2 border border-gray-300 rounded w-full md:w-[30%]"
            placeholder="Filter by Transaction Account"
          />
          <button
            onClick={handleUpdateTable}
            className="p-2 bg-blue-500 text-white rounded w-full md:w-[30%] hover:bg-blue-600"
          >
            Update Table
          </button>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full text-left">
            <thead>
              <tr className="bg-gray-100 table-fixed">
                <th className="border border-gray-300 p-2">Owner Name</th>
                <th className="border border-gray-300 p-2">Product Count</th>
                <th className="border border-gray-300 p-2">Date</th>
                <th className="border border-gray-300 p-2">Transaction Account</th>
                <th className="border border-gray-300 p-2">Amount</th>
                <th className="border border-gray-300 p-2">Type</th>
                <th className="border border-gray-300 p-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item:any, index:number) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2">{item.owner.name}</td>
                  <td
                    className="border border-gray-300 p-2 relative"
                    onMouseEnter={(e) => handleMouseEnter(item.product.map((p:any) => p.name), e)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {item.product.length}
                  </td>
                  <td className="border border-gray-300 p-2">{item.date}</td>
                  <td className="border border-gray-300 p-2">
                    {item.transaction.account}
                  </td>
                  <td className="border border-gray-300 p-2">{item.amount}</td>
                  <td className="border border-gray-300 p-2">{item.type}</td>
                  <td className="border border-gray-300 p-2">{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No results found.</p>
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
'use client'

import { FormatCurrency } from "@/helpers/format.currency";
import { DirectusAPI } from "@/services/directus.api.service";
import { MetricsService } from "@/services/metrics.service";
import { useAppDispatch } from "@/store";
import React, { useEffect, useState } from "react";

const denominations = [
  { label: "$ 50", value: 50 },
  { label: "$ 100", value: 100 },
  { label: "$ 200", value: 200 },
  { label: "$ 500", value: 500 },
  { label: "$ 1.000", value: 1000 },
  { label: "$ 2.000", value: 2000 },
  { label: "$ 5.000", value: 5000 },
  { label: "$ 10.000", value: 10000 },
  { label: "$ 20.000", value: 20000 },
  { label: "$ 50.000", value: 50000 },
  { label: "$ 100.000", value: 100000 },
];



const ReportForm: React.FC = () => {
  const [nequi, setNequi] = useState("");
  const [bancolombia, setBancolombia] = useState("");
  const [mercadoPago, setMercadoPago] = useState("");
  const [cash, setCash] = useState(Array(denominations.length).fill(2));
  const directus = new DirectusAPI();
  const metricsService = new MetricsService();

  const dispatch = useAppDispatch();

  useEffect(() => {

    

    const fetchData = async () => {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`,
      };
      try {
        const data = await directus.getItems({}, headers, "cash_report");
       console.log(data);
       if (data.length > 0) {
        setNequi(data[0].nequi.toString());
        setBancolombia(data[0].bancolombia.toString());
        setMercadoPago(data[0].mercaodpago.toString());
        
        setCash(Object.values(data[0].cash_counter))
        

      }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  

  const handleCashChange = (idx: number, value: string) => {
    const newCash = [...cash];
    newCash[idx] = Number(value);
    setCash(newCash);
  };

  const totalCash = cash.reduce(
    (sum, qty, idx) => sum + qty * denominations[idx].value,
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    const reportData = {
      nequi: parseInt(nequi),
      bancolombia: parseInt(bancolombia),
      mercaodpago: parseInt(mercadoPago),
      cash: totalCash,
      cash_counter: cash,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`,
    };

    let amount = parseInt(nequi) + parseInt(bancolombia) + parseInt(mercadoPago) + totalCash;
    metricsService.updateAmountReported(dispatch,amount);

    directus.updateItem(1,reportData,headers,'cash_report').then((res) => {
      console.log(res);
      alert("Reporte guardado!");
    }
    ).catch((err) => {
      console.log(err);
      alert("Error al guardar el reporte!");
    });
    
    

  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-6  w-[300px] md:w-[400px] h-[490px] overflow-y-auto "
      >
        <h2 className="text-xl font-bold text-center mb-6">Reportar cantidad</h2>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Nequi</label>
          <input
            type="number"
            placeholder="Ej : $ 50.000"
            className="w-full bg-gray-200 rounded-md px-4 py-2 outline-none"
            value={nequi}
            onChange={(e) => setNequi(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Bancolombia</label>
          <input
            type="number"
            placeholder="Ej : $ 50.000"
            className="w-full bg-gray-200 rounded-md px-4 py-2 outline-none"
            value={bancolombia}
            onChange={(e) => setBancolombia(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-1">Mercado Pago</label>
          <input
            type="number"
            placeholder="Ej : $ 50.000"
            className="w-full bg-gray-200 rounded-md px-4 py-2 outline-none"
            value={mercadoPago}
            onChange={(e) => setMercadoPago(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Efectivo</label>
          <div className="grid grid-cols-2  gap-3">
            {denominations.map((denom, idx) => (
              <div key={denom.value} className="flex items-center">
                <span className="bg-indigo-900 text-white rounded-l-md px-3 py-2 text-[13px] font-semibold min-w-[90px] text-center ">
                  {denom.label}
                </span>
                <input
                  type="number"
                  min={0}
                  className="bg-gray-200 rounded-r-md  w-[40px] text-center outline-none h-full pl-2 text-[13px] "
                  value={cash[idx]}
                  onChange={(e) => handleCashChange(idx, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-gray-500 mt-6 mb-4 text-md">
          Total Efectivo : <span className="font-semibold text-gray-700">${" "}
          {totalCash.toLocaleString("es-CO")}</span>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-900 text-white py-3 rounded-md font-semibold hover:bg-indigo-800 transition"
        >
          Guardar Reporte
        </button>
      </form>
    </div>
  );
};

export default ReportForm;
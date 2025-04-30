import { useEffect, useRef, useState } from "react";
import ReportForm from "./amount.reported";
import { useAppSelector } from "@/store";
import { FormatCurrency } from "@/helpers/format.currency";


type PropsCardBalance = {
    transactions:Array<any>;
}

const CardBalance = (props:PropsCardBalance): React.JSX.Element => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [showReportForm, setShowReportForm] = useState<boolean>(false);
  const reportFormRef = useRef<HTMLDivElement | null>(null);

  const amountReported = useAppSelector((state) => state.metrics.amountReported);

  // Close ReportForm when clicking outside
  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {
      if (
        reportFormRef.current &&
        !reportFormRef.current.contains(event.target as Node)
      ) {
        setShowReportForm(false);
      }
    };

    if (showReportForm) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showReportForm]);
 

  // Filtrar transacciones por rango de fechas
  const filteredTransactions = props.transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date_transaction);
    const isAfterStartDate = startDate ? transactionDate >= new Date(startDate) : true;
    const isBeforeEndDate = endDate ? transactionDate <= new Date(endDate) : true;
    return isAfterStartDate && isBeforeEndDate;
  });

  // Calcular totales
  const totalEntrada = filteredTransactions
    .filter((transaction) => transaction.type === "entrada")
    .reduce((sum, transaction) => sum + parseInt(transaction.amount), 0);

  const totalSalida = filteredTransactions
    .filter((transaction) => transaction.type === "salida")
    .reduce((sum, transaction) => sum + parseInt(transaction.amount), 0);


    return<>
    

        <section className="bg-white w-[290px] md:w-[430px] h-[500px] rounded-md shadow-md p-4 m-4 " >
            <div className="title">Balance General</div>
            <hr className=" mt-2" />

            {/* Filtros de Fecha */}
            <div className="date-filters  flex justify-around text-[13px] pt-1 pb-1">
                <div className="mb-2">
                    <label className="block text-[12px] font-medium text-[#8d8d8d] ">Fecha de inicio</label>
                    <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className=" border border-gray-300 rounded w-full max-w-[109px] max-h-[25px]"
                    />
                </div>
                <div>
                    <label className="block text-[12px] font-medium text-[#8d8d8d] ">Fecha de fin</label>
                    <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className=" border border-gray-300 rounded w-full max-w-[109px] max-h-[25px]"
                    />
                </div>
            </div>
            {/* Fin de Filtros de Fecha */}

            <hr className="mb-2 " />
          
            <div className="container-entrada-salida w-[100%] flex justify-around mt-4">
                <div className="entrada">
                    <div className="entrada-title text-[13px] text-[#858585]">Entradas Totales</div>
                    <div className="entrada-amount font-bold text-[#137c1c] text-[22px]"> {FormatCurrency(totalEntrada,'COP')}</div>
                </div>
                <div className="salida">
                    <div className="entrada-title text-[13px] text-[#858585]">Salidas Totales</div>
                    <div className="salida-amount  font-bold text-[#da2a2a] text-[22px]"> {FormatCurrency(totalSalida,'COP')}</div>
                </div>
            </div>
             <div className="container-entrada-salida w-[100%] flex justify-around mt-4 border-t border-[#e2e2e2] pt-2">
                <div className="entrada">
                    <div className="entrada-title text-[13px] text-[#858585]">Cantidad Calculada</div>
                    <div className="entrada-amount font-bold text-[#858585] text-[22px]"> {FormatCurrency((totalEntrada-totalSalida),'COP')}</div>
                </div>
                <div className="salida cursor-pointer" onClick={() => setShowReportForm(true)}>
                    <div className="entrada-title text-[13px] text-[#858585]">Cantidad Reportada</div>
                    <div className="salida-amount  font-bold text-[#858585] text-[22px]">{FormatCurrency(amountReported,'COP')}</div>
                </div>
            </div>
            <div className="container-entrada-salida w-[100%] flex justify-around mt-4 border-t border-[#e2e2e2] pt-2">
                <div className="entrada">
                    <div className="entrada-title text-[13px] text-[#858585]">Balance</div>
                    {
                        (totalEntrada - totalSalida) - amountReported > 0 ? (
                            <div className="entrada-amount font-bold text-[#137c1c] text-[26px]"> {FormatCurrency(((totalEntrada - totalSalida) - amountReported),'COP')}</div>
                        ) :
                        (totalEntrada - totalSalida) - amountReported < 0 ? (
                            <div className="entrada-amount font-bold text-[#da2a2a] text-[26px]"> {FormatCurrency(((totalEntrada - totalSalida) - amountReported),'COP')}</div>
                        ):
                        <div className="entrada-amount font-bold text-[#a3831a] text-[26px]"> {FormatCurrency(((totalEntrada - totalSalida) - amountReported),'COP')}</div>
                        
                    }
                   
                </div>
            </div>

            <hr className="mb-2 mt-4" />

            {/* ReportForm */}
            {showReportForm && (
            <div
                className="container-report-from absolute top-0 left-0 bg-[#0000008f] w-screen h-screen z-10 flex justify-center items-center"
                
            >
                <span ref={reportFormRef}>

                    <ReportForm />
                </span>

            </div>
            )}

        </section>

    </>

}
export default CardBalance;
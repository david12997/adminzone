import { FormatCurrency } from "@/helpers/format.currency";
import { NewRequests } from "@/helpers/request";
import { setData, setTotalAmountEntered, setAmountReported } from "@/store/metrics";
import { DirectusAPI } from "./directus.api.service";

export class MetricsService {

    async setMetrics(dispatch: any) {
        try {
            // new request to obtain metrics
            NewRequests([
                'https://db-adminzone.aipus.shop/inverzone/items/transaction?fields=*,transaction_products.*,transaction_products.product_id.id,transaction_products.product_id.status,transaction_products.product_id.name,,transaction_products.product_id.base,transaction_products.product_id.media,transaction_products.product_id.unit_price,transaction_products.product_id.combo_price,transaction_products.product_id.mayor_price,transaction_products.product_id.ml_price,transaction_products.product_id.stock,transaction_account.*,transaction_owner.owner_id.*'
            ],'GET').then((response) => {
                
                console.log(response);
                
                dispatch(setData(response[0].data));
                this.totalBaseRevocered(response[0].data);
                this.totalGrossProfitPerTransaction(response[0].data[56]);
                this.totalBaseRecoveredPerTransaction(response[0].data[56]);
                dispatch(setTotalAmountEntered(this.totalAMountEntered(response[0].data)));

                this.profitPerInversor(2218895,1520307,200000)
                
               
            })
            .catch((error) => {console.log(error)})

            const directusAPI = new DirectusAPI();
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`,
            };
            const data = await directusAPI.getItemById(1, '*', headers, 'cash_report');
            
            if(data !== null && data !== undefined){

                let amount = data.bancolombia+data.cash+data.mercaodpago+data.nequi;
                dispatch(setAmountReported(amount));
            }

        } catch (error) {

            console.error("Error setting metrics:", error);
        }


    }

    private totalAMountEntered(metricStore:any) {

        let total = 0;
        metricStore.forEach((metric:any) => {
           if(metric.type === 'entrada') total += parseInt(metric.amount)
        });

        return total;
    }

    private totalAMountExit(metricStore:any) {

        let total = 0;
        metricStore.forEach((metric:any) => {
           if(metric.type === 'salida') total += parseInt(metric.amount)
        });

        return total;
    }

    totalBaseRevocered(metricStore:any) {      
        let totalBase = 0;
        let totalSalidaBase = 0;
        const allProducts = metricStore
        .filter((metric: any) => metric.type === 'entrada')  // filtra solo las entradas
        .flatMap((metric: any) => metric.transaction_products); // aplana todos los productos en un solo array

        allProducts.forEach((product: any) => { 
            totalBase+= parseInt(product.product_id.base) 
        
        });



        metricStore.forEach((metric:any) => {
            if(metric.type === 'salida' && metric.description.toLowerCase().includes('base')) totalSalidaBase += parseInt(metric.amount)
         });

        console.log(totalBase - totalSalidaBase);
        console.log(totalBase);
        console.log(totalSalidaBase);
    }

    totalBaseRecoveredPerTransaction(transaction:any) {
        
        let totalBase = 0;

        if(transaction.type === 'entrada'){

            transaction.transaction_products.forEach((product: any) => { 

                totalBase+= parseInt(product.product_id.base) 

                console.log(totalBase);
                return totalBase;
            });


          

        }

        return totalBase;

    }





    totalGrossProfitPerTransaction(transaction:any) {
        let total = 0;
        if(transaction.type=== 'entrada'){
            total = parseInt(transaction.amount) - this.getAmountDelivery(transaction.description);
        }

        for(let i = 0; i < transaction.transaction_products.length; i++){
            const product = transaction.transaction_products[i].product_id;

            total -= parseInt(product.base)
           
        }

       console.log(total);

    }

    totalProfitPerUser(user:string,amountProfit:number):number{

        if( user === 'admin'){
            return amountProfit * 0.3 // 30% for admin;
        }

        if( user === 'investor'){
            return amountProfit * 0.7 // 70% for user;
        }

        return 0;
    }

    operatingExpenses(amountProfit:number):number{

        if (amountProfit > 0 && amountProfit !== null) {

            return amountProfit * 0.4; // 10% for operating expenses;
        }

        return 0;
    }

    profitPerInversor(
        totalInvestment: number,
        inversorAmount: number,
        totalProfit: number
    ): number {
        const percentageInversor = inversorAmount / totalInvestment;
        const profitForInversor = totalProfit * percentageInversor;
        console.log(`El inversor ${inversorAmount} tiene un porcentaje de ${percentageInversor} y su ganancia es de ${profitForInversor}`);
        return profitForInversor;
    }



    private getAmountDelivery(data:string) {

        const match = data.match(/\$(.*?)\$/);

        if (match) {
            const valor = match[1]; // match[1] contiene lo que está entre los $ $
            return parseInt(valor);
        } else {
            return 0;
        }
    }


    updateAmountReported = (dispatch:any, amountReported:any) => {
        dispatch(setAmountReported(amountReported));
    }


}
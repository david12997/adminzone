import { FormatCurrency } from "@/helpers/format.currency";
import { NewRequests } from "@/helpers/request";
import { setData, setTotalAmountEntered } from "@/store/metrics";

export class MetricsService {

    async setMetrics(dispatch: any) {
        try {
            // new request to obtain metrics
            NewRequests([
                'https://db-adminzone.aipus.shop/inverzone/items/transaction?fields=*,transaction_products.*,transaction_products.product_id.id,transaction_products.product_id.status,transaction_products.product_id.name,,transaction_products.product_id.base,transaction_products.product_id.media,transaction_products.product_id.unit_price,transaction_products.product_id.combo_price,transaction_products.product_id.mayor_price,transaction_products.product_id.ml_price,transaction_products.product_id.stock,transaction_account.*,transaction_owner.owner_id.*'
            ],'GET').then((response) => {
                
                console.log(response);
                
                dispatch(setData(response[0].data));
                dispatch(setTotalAmountEntered(this.totalAMountEntered(response[0].data)));
                
               
            })
            .catch((error) => {console.log(error)})

        } catch (error) {

            console.error("Error setting metrics:", error);
        }
    }

    private totalAMountEntered(metricStore:any) {

        let total = 0;
        metricStore.forEach((metric:any) => {
           if(metric.type === 'entrada') total += parseInt(metric.amount)
        });

        return FormatCurrency(total,'COP');
    }



}

import { TransactionTable } from "@/components/section.movements/transactions/transaction.table";
import { NewRequests } from "@/helpers/request";


function transformTransaction(data:any) {
  return {
      owner: { name: data.transaction_owner[0]?.owner_id?.name || "Unknown" },
      product: data.transaction_products.map((tp: { product_id?: { name?: string } }) => ({
          name: tp.product_id?.name || "Unknown Product"
      })),
      date: data.date_transaction || "Unknown Date",
      transaction: { account: data.transaction_account?.account_number || "Unknown Account" },
      amount: Number(data.amount) || 0,
      type: data.type.charAt(0).toUpperCase() + data.type.slice(1), // Capitalizing type
      description: data.description || "No Description"
  };
}

export default async function Transacciones() {

  const data = await NewRequests([
    'https://db-adminzone.aipus.shop/inverzone/items/transaction?fields=*,transaction_products.*,transaction_products.product_id.id,transaction_products.product_id.status,transaction_products.product_id.name,,transaction_products.product_id.base,transaction_products.product_id.media,transaction_products.product_id.unit_price,transaction_products.product_id.combo_price,transaction_products.product_id.mayor_price,transaction_products.product_id.ml_price,transaction_products.product_id.stock,transaction_account.*,transaction_owner.owner_id.*'
  ],'GET');

  const transactions:any[] = [];

  for (let i = 0; i < data[0].data.length; i++) {
    
    transactions.push(transformTransaction(data[0].data[i]));
  }

  
 
  
  return (
    <> 
      <section className="border border-red-700 w-[80%] md:w-[85%] h-[86vh] ml-[64px] md:ml-[150px] mt-[80px] md:mt-[60px] flex justify-around flex-wrap overflow-y-scroll m-2 p-2 items-center">
        <TransactionTable  transactionData={transactions}/>
      </section>

    </>
  );

}
  
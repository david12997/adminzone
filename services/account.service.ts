import { NewRequests } from "@/helpers/request";
import { setOwnersAccounts } from "@/store/owner";


/**
 * @description Service to manage the owners and owner's accounts
 * @class OwnerService
 * @method setOwnersAccounts
 * 
*/

export class AccountService {

    /**
     * @description Method to set the  accounts and save them in the store
     * @param dispatch
     * @method setAccounts
     * 
     * 
    */
    async setAccounts(dispatch: any) {
        try {

            // new request to obtain  accounts
            NewRequests([
                process.env.NEXT_PUBLIC_PROD_API_URL+'/api/accounts?limit=50&offset=0'
            ],'POST').then((response) => {
                
                
                dispatch(setOwnersAccounts(response[0].data));
            })
            .catch((error) => {console.log(error)})

        } catch (error) {

            console.error("Error setting owner:", error);
        }
    }

}

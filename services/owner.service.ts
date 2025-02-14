import { NewRequests } from "@/helpers/request";
import { setOwners } from "@/store/owner";


/**
 * @description Service to manage the owners and save them in the store
 * @class OwnerService
 * @method setOwners
 * 
*/

export class OwnerService {

    /**
     * @description Method to set the owners a
     * @param dispatch
     * @method setOwners
     * 
     * 
    */
    async setOwners(dispatch: any) {
        try {

            // new request to obtain owners and accounts
            NewRequests([
                process.env.NEXT_PUBLIC_PROD_API_URL+'/api/owners?limit=50&offset=0',
            ],'POST').then((response) => {
                
                
                dispatch(setOwners(response[0].data));
                
            })
            .catch((error) => {console.log(error)})

        } catch (error) {

            console.error("Error setting owner:", error);
        }
    }

}


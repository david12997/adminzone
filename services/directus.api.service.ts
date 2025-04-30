export class DirectusAPI {

    private baseURL = 'https://db-adminzone.aipus.shop/inverzone'; // Replace with your Directus instance URL


    // CREATE - Create a new item
     async createItem(data:any,headers:any, collection:string) {
        try {
            const response = await fetch(`${this.baseURL}/items/${collection}`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error creating item:', error);
            throw error;
        }
    }

    // READ - Get all items with optional query parameters
     async getItems(params:any = {}, headers:any, collection:string) {
        try {
            // Build query string from params
            const queryString = new URLSearchParams({
                fields: params.fields || '*',
                sort: params.sort || '-id',
                limit: params.limit || 20,
                page: params.page || 1,
                ...params.filter && { filter: JSON.stringify(params.filter) }
            }).toString();

            const response = await fetch(
                `${this.baseURL}/items/${collection}?${queryString}`, {
                method: 'GET',
                headers: headers
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error fetching items:', error);
            throw error;
        }
    }

    // READ - Get a single item by ID
     async getItemById(id:any, fields = '*',headers:any,collection:string) {
        try {
            const response = await fetch(
                `${this.baseURL}/items/${collection}/${id}?fields=${fields}`, {
                method: 'GET',
                headers: headers
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error fetching item:', error);
            throw error;
        }
    }

    // UPDATE - Update an item by ID
     async updateItem(id:any, data:any, headers:any, collection:string) {
        try {
            const response = await fetch(
                `${this.baseURL}/items/${collection}/${id}`, {
                method: 'PATCH',
                headers: headers,
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error updating item:', error);
            throw error;
        }
    }

    // DELETE - Delete an item by ID
     async deleteItem(id:any , headers:any, collection:string) {
        try {
            const response = await fetch(
                `${this.baseURL}/items/${collection}/${id}`, {
                method: 'DELETE',
                headers: headers
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return true; // Successful deletion
        } catch (error) {
            console.error('Error deleting item:', error);
            throw error;
        }
    }

    // Authentication
     async login(email:string, password:string) {
        try {
            const response = await fetch(`${this.baseURL}/auth/authenticate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.data.token;
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    }
}
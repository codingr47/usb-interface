import USBProduct from './USBProduct';
import USBVendor  from './USBVendor';
export default class USBDataset {
    
    vendors: Array<USBVendor>
    products: Array<USBProduct>
    expected_rows: Array<string>;

    private vendorsDictionary:any; // Vendor's dictionary for vendors' indexes
    private productsDictionary:any; // Products's dictionary for products' indexes
    
    static SingleInstance:USBDataset = null; // this is a static reference to the single Instance of this dataset
    /**
     * This function attempts to create the dataset from static json files, 
     * if created successfully, stores a Singleton instance in the prototype of the class, for easy access.
     * this function cannot be called more than once in the same process.
     * @param vendors a JSON object that is expected to contain all relevant vendor data
     * @param products a JSON object that is expected to contain all relevant product data
     * @return USBDataset, created by this function using passed data
     */
    static CreateFromJSON(vendors:any, products:any) : USBDataset {
        if(USBDataset.SingleInstance !== null)
            throw new Error("Cannot create db instance more than once in same process");
        const dataset = new USBDataset();
        const vendors_keys:any = Object.keys(vendors);
        const products_keys:any = Object.keys(products);
        for(let i =0; i<vendors_keys.length; i++) {
            const vendor:any = vendors[vendors_keys[i]];
            dataset.addVendor(new USBVendor(vendor.id, vendor.name));
        }
        for(let i =0; i<products_keys.length; i++) {
            const product:any = products[products_keys[i]];
            dataset.addProduct(new USBProduct(product.id, product.name, product.vendor_id));
        }
        USBDataset.SingleInstance = dataset;
        return USBDataset.SingleInstance;

    }

    constructor() {
        this.vendors = [];
        this.products = [];
        this.expected_rows = [];
        this.vendorsDictionary = {};
        this.productsDictionary = {};
    }
    addVendor(vendor:USBVendor) : void {
        this.vendors.push(vendor);
        this.vendorsDictionary[vendor.id] = this.vendors.length-1;
    }
    addProduct(product:USBProduct) : void {
        this.products.push(product);
        this.productsDictionary[product.id] = this.products.length-1;
    }
    /**
     * this method adds a line that is expected to be processed.
     * this method is only used while the database is being built from text based DB 
     * @param line:string the line that is being processed
     */
    addExepectedForProcessingRow(line:string) : void {
        this.expected_rows.push(line);
    }

    getVendorByID(id:number) : USBVendor {
        return this.vendors[this.vendorsDictionary[id]];
    }
    getProductByID(id:number) : USBProduct {
        return this.products[this.productsDictionary[id]];
    }
}
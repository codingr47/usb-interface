import USBProduct from "./USBProduct";
import USBVendor from "./USBVendor";
import USBDataset from "./USBDataset";

export default class USBConnectedDevice {
    busNumber:number;
    product:USBProduct;
    vendor:USBVendor;
    children:Array<USBConnectedDevice>;
    parentID:number;

    /**
     * this function gets data from the usb api and returns a localized instance of USBConnectedDevice
     * @param device - device instance from 'usb' external api library
     * @param children - optional, a list of children devices.
     */
    static CreateInstanceFromAPI(device:any, children:Array<USBConnectedDevice> = null) : USBConnectedDevice {
        const {busNumber} = device;
        const {idProduct, idVendor} =  device.deviceDescriptor; 
        const db = USBDataset.SingleInstance;
        return new USBConnectedDevice(
            busNumber,
            db.getProductByID(idProduct),
            db.getVendorByID(idVendor),
            children,
            device.parent === null ? null : device.parent.deviceDescriptor.idProduct
        );
    }

    constructor(_busNumber: number = null, _product:USBProduct = null, _vendor:USBVendor = null, _children:Array<USBConnectedDevice> = null, _parentID:number = null) {
        this.busNumber = _busNumber;
        this.product = _product;
        this.vendor = _vendor;
        this.children = _children;
        this.parentID = _parentID;
    }
}
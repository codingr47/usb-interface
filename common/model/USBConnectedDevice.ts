import USBProduct from "./USBProduct";
import USBVendor from "./USBVendor";
import USBDataset from "./USBDataset";
const md5 = require("blueimp-md5");
export default class USBConnectedDevice {
    key:string;
    busNumber:number;
    product:USBProduct;
    vendor:USBVendor;
    children:Array<USBConnectedDevice>;
    parentKey:string;

    /**
     * this function gets data from the usb api and returns a localized instance of USBConnectedDevice
     * @param device - device instance from 'usb' external api library
     * @param children - optional, a list of children devices.
     */
    static CreateInstanceFromAPI(device:any, children:Array<USBConnectedDevice> = null) : USBConnectedDevice {
        const {busNumber} = device;
        const {idProduct, idVendor} =  device.deviceDescriptor; 
        const db = USBDataset.SingleInstance;
        const getKeyFromDevice = (device:any) : string  => {
            const busNumber:string = device.busNumber ?  device.busNumber.toString() : '';
            const idProduct:string = device.deviceDescriptor.idProduct ? device.deviceDescriptor.idProduct.toString() : '';
            const idVendor:string  = device.deviceDescriptor.idVendor  ? device.deviceDescriptor.idVendor.toString() : '';
            const deviceAddress:string = device.deviceAddress ? device.deviceAddress.toString() : '';
            return md5(busNumber+idProduct+idVendor+deviceAddress);

        }
        return new USBConnectedDevice(
            md5(getKeyFromDevice(device)),
            busNumber,
            db.getProductByID(idProduct),
            db.getVendorByID(idVendor),
            children,
            device.parent === null ? null : getKeyFromDevice(device.parent)
        );
    }

    constructor(_key:string = null, _busNumber: number = null, _product:USBProduct = null, _vendor:USBVendor = null, _children:Array<USBConnectedDevice> = null, _parentKey:string = null) {
        this.key = _key;
        this.busNumber = _busNumber;
        this.product = _product;
        this.vendor = _vendor;
        this.children = _children;
        this.parentKey = _parentKey;
    }
}
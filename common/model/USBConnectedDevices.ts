import USBConnectedDevice from './USBConnectedDevice';
import USBDataset from './USBDataset';
const usb = (!process.env.IS_CLIENT) ? require("usb") : null;
export default class USBConnectedDevices {
    
    devices:Array<USBConnectedDevice>;
    
    static SingleInstance:USBConnectedDevices = null; // this is a static reference to the single Instance of this datastructure

    /**
     * This static function GetsDevices from API, does some calculations in order to store
     * the data inside USBConnectedDevices data structure and then caches it inside a single instance.
     * this function will calculate the basic structure one time, and next time will serve the data from the cache.
     */
    static GetDevicesFromAPI() : USBConnectedDevices {
        if(USBConnectedDevices.SingleInstance !== null)
            return USBConnectedDevices.SingleInstance
        const all_devices = usb.getDeviceList();
        const already_handled:any = {};
        const findDevicesByParent = (parent:number = null, level:number = 0) => {
            let devices = all_devices.filter( (device:any) => {
                let retVal;
                if(parent === null)
                    retVal = device.parent === null
                else {
                    if(device.parent === null) retVal =  false;
                    else
                        retVal = device.parent.deviceDescriptor.idProduct === parent;
                }
                return retVal && !already_handled[device.deviceDescriptor.idProduct];

            });
            
            if(devices.length == 0) return null;
            for(let i = 0; i<devices.length; i++) {
                const device = devices[i];
                already_handled[device.deviceDescriptor.idProduct] = true;
                const children:Array<USBConnectedDevice> = findDevicesByParent(device.deviceDescriptor.idProduct, level+1);
                devices[i] =  USBConnectedDevice.CreateInstanceFromAPI(device, children);
            }
            return devices;
        
        };
        const devices:Array<USBConnectedDevice> =  findDevicesByParent(null);
        const connected_devices = new USBConnectedDevices(devices);
        USBConnectedDevices.SingleInstance = connected_devices;
        return connected_devices;
    }
    static findElementByProductID(devices:Array<USBConnectedDevice>, productID:number) : USBConnectedDevice {
        for(let i = 0; i<devices.length; i++) {
            const device:USBConnectedDevice = devices[i];
            if(device.product && device.product.id == productID)
                return device;
            if(device.children !== null)
                return USBConnectedDevices.findElementByProductID(device.children, productID);      
        }
        return null;
    }

    
    constructor(_devices:Array<USBConnectedDevice> = null) { 
        this.devices = _devices === null ? [] : _devices;
    }

    
    insertElement(device:any) : void {
        const db = USBDataset.SingleInstance;
        const parent:number = typeof(device.parent == Number) ? device.parent : device.parent.deviceDescriptor.idProduct;
        const parent_element:USBConnectedDevice = USBConnectedDevices.findElementByProductID(this.devices, parent);
        if(parent_element !== null)
            parent_element.children.push(USBConnectedDevice.CreateInstanceFromAPI(device, null));

    }
    removeElement(device:any) : void {
        const db = USBDataset.SingleInstance;
        const parent:number = typeof(device.parent == Number) ? device.parent : device.parent.deviceDescriptor.idProduct;
        const parent_element:USBConnectedDevice = USBConnectedDevices.findElementByProductID(this.devices, parent);
        if(parent_element !== null ) 
            parent_element.children = parent_element.children.filter( (device_in_question:USBConnectedDevice) => {
                if(device_in_question.product === undefined) return true;
                return device_in_question.product.id !== db.getProductByID(device.deviceDescriptor.idProduct).id;
            }); 
    }

    
}
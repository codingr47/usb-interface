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
    /**
     * static recursive method that searches the tree for a specific product.
     * @param - devices:Array<USBConnectedDevice> default should be the 0 level devices list.
     * @param - key:string - the device's key to search for
     * @return - USBConnectedDevice
     */
    static findElementByKey(devices:Array<USBConnectedDevice>, key:string) : USBConnectedDevice {
        let elementInChildren = null;
        for(let i = 0; i<devices.length; i++) {
            
            const device:USBConnectedDevice = devices[i];
            if(device && device.key == key)
                return device;
            if(device.children !== null)
                elementInChildren = USBConnectedDevices.findElementByKey(device.children, key);      
            if(elementInChildren) return elementInChildren
        }
        return null;
    }

    
    constructor(_devices:Array<USBConnectedDevice> = null) { 
        this.devices = _devices === null ? [] : _devices;
    }

    /**
     * inserts an element as a child of the parent
     * @param device:USBConnectedDevice - the device, already inside the model
     */
    insertElement(device:USBConnectedDevice) : void {
        const parentKey:string = device.parentKey;
        const parent_element:USBConnectedDevice = USBConnectedDevices.findElementByKey(this.devices, parentKey);
        if(parent_element !== null)
            parent_element.children.push(device);

    }
    /**
     * removes an element from his expected parent's children
     * @param device:USBConnectedDevice - the device, already inside the model
     */
    removeElement(device:USBConnectedDevice) : void {
        const db = USBDataset.SingleInstance;
        const parentKey:string = device.parentKey;
        const parent_element:USBConnectedDevice = USBConnectedDevices.findElementByKey(this.devices, parentKey);
        if(parent_element !== null ) 
            parent_element.children = parent_element.children.filter( (device_in_question:USBConnectedDevice) => {
                return device_in_question.key != device.key
            }); 
        
    }

    
}
import USBDataset from "../../common/model/USBDataset";
import USBConnectedDevices from "../../common/model/USBConnectedDevices";
import { USBEvent } from "../../common/model/USBEvents";
import USBConnectedDevice from "../../common/model/USBConnectedDevice";

const usb = require("usb");

export class USBBehaviour {
    /**
     * this function uses the static GetDevicesFromAPI function from USBConnectedDevices to get an instance of the datasturctures
     * @returns Array<USBConnectedDevice>
     */
    static devices() : Array<USBConnectedDevice> {
        return USBConnectedDevices.GetDevicesFromAPI().devices;
    }
    /**
     * addEventListener - this function adds a 
     * @param event  - the USBevent name
     * @param networkEventBehaviour - a network  wrap function who will be called when event occours
     * @param args - args to be passed to networkEventBehaviour
     */
    static addEventListener(event:USBEvent, networkEventBehaviour:Function, args:Array<any>) : void {
        usb.on(event, (device:any) => {
	    console.log("event");
            const usbEvent:USBConnectedDevice = USBConnectedDevice.CreateInstanceFromAPI(device);
            const db:USBDataset = USBDataset.SingleInstance;
            const devices:USBConnectedDevices = USBConnectedDevices.GetDevicesFromAPI();
            if(event == USBEvent.ATTACH) {
                devices.insertElement(usbEvent);
            }
            if(event == USBEvent.DETACH) {
                devices.removeElement(usbEvent);
            }
            networkEventBehaviour(event, usbEvent, args)
        });
    }
}
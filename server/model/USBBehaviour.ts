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
    static addEventListener(event:USBEvent, networkEventBehaviour:Function, args:Array<any>) {
        usb.on(event, (device:any) => {
            const usbEvent:USBConnectedDevice = USBConnectedDevice.CreateInstanceFromAPI(device);
            const db:USBDataset = USBDataset.SingleInstance;
            const devices:USBConnectedDevices = USBConnectedDevices.GetDevicesFromAPI();
            if(event == USBEvent.ATTACH) {
                console.log(usbEvent);
                devices.insertElement(usbEvent);
            }
            if(event == USBEvent.DETACH) {
                devices.removeElement(usbEvent);
            }
            networkEventBehaviour(event, usbEvent, args)
        });
    }
}
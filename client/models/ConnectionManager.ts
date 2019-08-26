import USBWebsocketsClient from "./USBWebsocketsClient";
import USBConnectedDevices from '../../common/model/USBConnectedDevices';
import USBConnectedDevice from "../../common/model/USBConnectedDevice";
import { USBEvent } from '../../common/model/USBEvents';
import StateManager from "./StateManager";
let state_setter:Function;

export default class ConnectionManager {
    server:USBWebsocketsClient;
    constructor() {
        this.server = new USBWebsocketsClient(this.messages);
        this.server.instance.onopen =  () => { 
            this.server.devices();
        }
    }

    messages(event:any) {
        const data = JSON.parse(event.data);
        if(data.event === undefined) {        
            const devices:USBConnectedDevices = Object.assign(new USBConnectedDevices(), {devices:data});
            StateManager.GetInstance().SetUSBConnectedDevices(devices);
        }
        else {

            const eventName:string = data.event;
            if(eventName) {
		
                if(eventName == USBEvent.ATTACH) {
                    const device = Object.assign(new USBConnectedDevice(), data.data);
                    StateManager.GetInstance().GetUSBConnectedDevices().insertElement(device); 
                }
                else if (eventName == USBEvent.DETACH) {
		    console.log("event happend client");
                    const device = Object.assign(new USBConnectedDevice(), data.data);
                    StateManager.GetInstance().GetUSBConnectedDevices().removeElement(device);
                }
                StateManager.GetInstance().RefreshState();
            }
        }
    }
}

import USBWebsocketsClient from "./USBWebsocketsClient";
import USBConnectedDevices from '../../common/model/USBConnectedDevices';
import USBConnectedDevice from "../../common/model/USBConnectedDevice";
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
        if(event.data.event === undefined) {
            const data = JSON.parse(event.data);
            const devices:USBConnectedDevices = Object.assign(new USBConnectedDevices(), {devices:data});
            StateManager.GetInstance().set({deviceManager: devices});
        }
        else {

        }
    }
}

import IUSBClient from "./IUSBClient";
import config from './config';
import USBConnectedDevice from '../../common/model/USBConnectedDevice';
import BaseWebsocketsRouter from '../../common/routes/BaseWebsocketsRouter';
export default class USBWebsocketsClient implements IUSBClient {
    
    instance: any;    
    router: BaseWebsocketsRouter;
    
    constructor(_onMessage:Function) {
       this.instance = new WebSocket(config.server);
       this.router = new BaseWebsocketsRouter();

       this.instance.onmessage = _onMessage;
       
    }
    devices(): void {
       const route = this.router.getRouteByName("devices");
       this.instance.send(route.route);
    }


}
import USBDataset from "../../common/model/USBDataset";
import { BaseRouter } from "../../common/routes/BaseRouter";
export default interface INetwork {
    server:any // this keeps server instance -   an instance of the server.
    db:USBDataset // this keeps the usbdataset - a dataset of all usb metadata.
    networkDecorator:Function // this keeps the networkDecotrator - a decorator function which takes USBBehavior functions and adds the network functionality
    routes:BaseRouter; // this keeps the BaseRouter - a specific child of the BaseRouter class.
    create(port:number) //in this function server is being created
    middlewares() // this will apply all middlewares for server. e.x. for HTTPServer, all routes will be applied here. for WebSocketServer, all event handlers will be placed here
    events() // this will apply all events for server. e.x. for HTTPServer, state changes, for WebSocketServer, 
}
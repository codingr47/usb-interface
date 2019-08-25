import INetwork from './INetwork';
import USBDataset from "../../common/model/USBDataset";
import BaseWebsocketsRouter from '../../common/routes/BaseWebsocketsRouter';
import { USBBehaviour } from './USBBehaviour';
import { USBEvent } from '../../common/model/USBEvents';
import USBConnectedDevice from '../../common/model/USBConnectedDevice';

const http = require("http");
var WebSocketServer = require('websocket').server;

export default class NetworkWebsockets implements INetwork {

    server:any 
    db:USBDataset 
    instance:any;
    routes:BaseWebsocketsRouter;
    connections:any[];

    constructor() {
        USBDataset.CreateFromJSON(require('../db/vendors.json'), require('../db/products.json'));
        this.routes = new BaseWebsocketsRouter();
        this.connections = [];
        this.networkDecorator = this.networkDecorator.bind(this);
    }

    networkDecorator(wrappedFunction:Function) {
        return function (connection:any) {
            const result = wrappedFunction.apply(this, arguments);
            connection.sendUTF(JSON.stringify(result));
            
        }
    }

    eventBehaviour(event:USBEvent, device:USBConnectedDevice, connections:any[]) {
        const ret_json:string = JSON.stringify({
            event,
            data: device
        });
        for(let i =0; i<connections.length; i++) {
            connections[i].sendUTF(ret_json);
        }
    }

    create(port:number) {
        console.log("creating server");
        this.server = http.createServer(  (request, response) => { 
           
        });
        this.server.listen(port, () => { });
        this.instance = new WebSocketServer({ httpServer: this.server});
        this.events();
    }
    middlewares() {
        console.log("middlewares");
        this.instance.on('request', (req)=> { 
            const connection = req.accept(null, req.origin);
            this.connections.push(connection);
            connection.on('message', (message) => { 
                console.log("message recieved");
                for(let i = 0; i<this.routes.getRoutes().length; i++) {
                    const route = this.routes.routes[i];
                    if(message.utf8Data == route.route) {
                        console.log(USBBehaviour,route.route_name);
                        this.networkDecorator(USBBehaviour[route.route_name])(connection);
                    }
                }
                
            });
        });
    }
    events() {
        USBBehaviour.addEventListener(USBEvent.ATTACH, this.eventBehaviour, this.connections);
        USBBehaviour.addEventListener(USBEvent.DETACH, this.eventBehaviour, this.connections);       
    }
}

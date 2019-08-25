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
    /**
     * this function takes a function to be wrapped, and then 
     * wrapps it in a new function that waits for the result 
     * of the original function and then sends this result to the connection.
     * @param wrappedFunction(@param connection - a specific connection ) : the function to be wrapped 
     * 
     */
    networkDecorator(wrappedFunction:Function) : Function {
        return function (connection:any) {
            const result = wrappedFunction.apply(this, arguments);
            connection.sendUTF(JSON.stringify(result));
            
        }
    }
    /**
     * 
     * @param event - USBEvent that was occoured
     * @param device - what device it regards
     * @param connections - the connections that the event should be transmitted to
     */
    eventBehaviour(event:USBEvent, device:USBConnectedDevice, connections:any[]) : void {
        const ret_json:string = JSON.stringify({
            event,
            data: device
        });
        for(let i =0; i<connections.length; i++) {
            connections[i].sendUTF(ret_json);
        }
    }

    /**
     * all instance creation of the websocket connection server
     */
    create(port:number) : void {
        console.log("creating server");
        this.server = http.createServer(  (request, response) => { 
           
        });
        this.server.listen(port, () => { });
        this.instance = new WebSocketServer({ httpServer: this.server});
        this.middlewares();
        this.events();
    }
    /**
     * all routes/actions logic
     */
    middlewares() : void {
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
    /**
     * a function that adds event listeners
     */
    events() : void {
        USBBehaviour.addEventListener(USBEvent.ATTACH, this.eventBehaviour, this.connections);
        USBBehaviour.addEventListener(USBEvent.DETACH, this.eventBehaviour, this.connections);       
    }
}

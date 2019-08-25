import { BaseRouter, BaseRoute } from "./BaseRouter";
const md5 = require('blueimp-md5') ;
/**
 * this is the base websockets router. 
 * it extends from BaseRouter
 * it includes the hashing logic of the base routes
 * it does not include any server/client logic
 **/
export default class BaseWebsocketsRouter extends BaseRouter {
    constructor() {
        super();
        this.routes = this.routes.map( (r:BaseRoute) => { 
            return new BaseRoute(r.route, this.shortHash(r.route));
        });

    }

    shortHash(route:string) {
        return md5(route).substr(0,4);
    }
}
/**
 * This Class contains routes, with behaviour and an accessor for 
 * and an accessor for the route name
 */
export class BaseRoute {
    route_name:string;
    route:string;
    behaviour: Function;

    constructor(_route_name:string, _route:string = null, _behaviour:Function = null) {
        this.route_name = _route_name;
        this.route = _route === null ? _route_name : _route;
        this.behaviour = _behaviour;

    }
    
}
export  class BaseRouter {
    routes:Array<BaseRoute>;
    constructor() {
        this.routes = [
            new BaseRoute("devices")
        ]
    }

    getRoutes() : BaseRoute[]  {
        return this.routes;
    }
    getRouteByName(route_name:string) : BaseRoute {
        return this.routes.filter( (route:BaseRoute) => { 
            return route.route_name == route_name;
        })[0];
    }
}
import * as React from 'react';
import USBWebsocketsClient from './models/USBWebsocketsClient';
import ConnectionManager from './models/ConnectionManager';
import StateManager from './models/StateManager';
import USBConnectedDevices from '../common/model/USBConnectedDevices';
import Devices from './components/Devices';

export interface MainProps { compiler:string; framework:string;}




export default class Main extends React.Component<MainProps, {deviceManager:USBConnectedDevices}> {
    connectionManager:ConnectionManager;
    stateManager:StateManager;

    constructor(props:MainProps) {
        super(props);
        this.state = {deviceManager:null};

        this.setState = this.setState.bind(this);
        this.stateManager = StateManager.GetInstance(this.setState);
        this.connectionManager = new ConnectionManager(); 
    }
    getDevices() : any { 
        if (!this.state.deviceManager)
            return [];
        const {devices} = this.state.deviceManager;
        return <Devices entities={devices} level={0} />
    }
    render() {
        return (<div>
                    <h1>The following devices are connected</h1>
                    <div id="devices">
                        {this.getDevices()}
                    </div>
            </div>);
    }
}
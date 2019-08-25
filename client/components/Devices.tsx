import * as React from 'react';
import USBConnectedDevice from '../../common/model/USBConnectedDevice';
import Device from './Device';

export interface DevicesProps {entities:USBConnectedDevice[], level:number}




export default class Devices extends React.Component<DevicesProps, {}> {


    constructor(props:DevicesProps) {
        super(props);
    }
    getDevices() : any { 
      
    }
    render() :any  {
        const devices = this.props.entities;
        if(!devices) return [];
        return (
        <div className="UsbDevices">
            {devices.map(device => { 
                return <Device entity={device} level={this.props.level} />
            })}
        </div>
        );
    }
}
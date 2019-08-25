import * as React from 'react';
import USBConnectedDevice from '../../common/model/USBConnectedDevice';
import Devices from './Devices';

export interface DeviceProps {entity:USBConnectedDevice, level:number}




export default class Device extends React.Component<DeviceProps, {}> {


    constructor(props:DeviceProps) {
        super(props);
    }
    getDevices() : any { 
      
    }
    render() {
        const device = this.props.entity;
        const {level} = this.props;
        return (device && 
            <div className={`UsbWrap level${level}`}>
                <div className="UsbDevice">
                    <span>{device.product ? device.product.name : 'Unknown Product'} ({device.vendor.name}) </span>
                </div>
                {device.children && <Devices entities={device.children} level={this.props.level+1} />}
            </div>
            );
    }
}
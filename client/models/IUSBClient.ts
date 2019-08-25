import USBConnectedDevice from '../../common/model/USBConnectedDevice';
export default interface IUSBClient {
    
    instance:any; //this holds the client-communication instance

    devices() : any;

}
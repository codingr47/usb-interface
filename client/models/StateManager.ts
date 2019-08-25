import USBConnectedDevices from "../../common/model/USBConnectedDevices";

export default class StateManager {
    
    private setState:Function;
    static  Instance:StateManager = null;
    
    private devices:USBConnectedDevices;

    static GetInstance(_setState:Function = null) : StateManager {
        if(StateManager.Instance === null)
            StateManager.Instance = new StateManager(_setState);
        return StateManager.Instance;
    }
    constructor(_setState:Function ){
        this.setState = _setState;
    }
    SetUSBConnectedDevices(_devices:USBConnectedDevices) {
        this.devices = _devices;
        this.set({deviceManager: this.devices});
    }
    GetUSBConnectedDevices() : USBConnectedDevices {
        return this.devices;
    }

    RefreshState() : void {
        this.set({deviceManager: this.devices});
    }

    set(obj:any) {
        this.setState(obj);
    }


}
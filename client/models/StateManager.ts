export default class StateManager {
    
    private setState:Function;
    static  Instance:StateManager = null;
    
    static GetInstance(_setState:Function = null) : StateManager {
        if(StateManager.Instance === null)
            StateManager.Instance = new StateManager(_setState);
        return StateManager.Instance;
    }
    constructor(_setState:Function ){
        this.setState = _setState;
    }

    set(obj:any) {
        this.setState(obj);
    }


}
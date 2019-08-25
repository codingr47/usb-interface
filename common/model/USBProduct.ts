export default class USBProduct {
    vendor_id: number;
    id:number;
    name:string;
    constructor(_id:number, _name:string, _vendor_id:number) {
        this.id = _id;
        this.name = _name;
        this.vendor_id = _vendor_id;
    }
}
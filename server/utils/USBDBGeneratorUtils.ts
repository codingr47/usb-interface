import USBProduct from '../../common/model/usb_product';
import USBVendor  from '../../common/model/usb_vendor';
import USBDataset from '../../common/model/usb_dataset';

const fetch:any = require("node-fetch");

//the RegExp pattern which is expected to match the vendors in the DB
const VENDOR_PATTERN:RegExp  = /^([0-9a-fA-F]+)(.+?)$/;
//the RegExp pattern which is expected to match products in the DB
const PRODUCT_PATTERN:RegExp = /^\u0009([0-9a-fA-F]+)(.+?)$/;


/*******************testRegex********************** 
 * this function  tests a line from the textual DB  with a given pattern 
 * @param line:string - the given line from the textual DB
 * @param pattern:RegExp - the pattern to be tested
 * @returns boolean - true if found, false if not
********************testRegex*********************/
const testRegex:Function = (line:string, pattern:RegExp) => pattern.test(line);


// 2 forks of testRegexp
const isVendor:Function  = (line:string) => testRegex(line, VENDOR_PATTERN);
const isProduct:Function = (line:string) => testRegex(line, PRODUCT_PATTERN);

/*******************extractByPattern********************** 
 *   this function processes a line from the textual DB and searches for a given pattern within it. 
 *   if found, it returns an array containing [id:number, name:string] 
 *   @param line:string - the given line from the textual DB
 *   @param pattern:RegExp - the pattern to search for inside the line
 *   @returns Array<any>
********************extractByPattern*********************/
const extractByPattern:Function = (line:string, pattern:RegExp) => {
    const results = line.match(pattern);
    if(results) {
        return [results[1], results[2]];
    }
    return [];
};

//2 forks of extractByPattern
const extractVendor:Function  = (line)  => extractByPattern(line, VENDOR_PATTERN);
const extractProduct:Function = (line)  => extractByPattern(line, PRODUCT_PATTERN); 



export const getUSBDatasetFromUSBDB:Function = () => {
        return fetch("http://www.linux-usb.org/usb.ids").then ( response => response.text()).then(text => { 
            
            const data:USBDataset = new USBDataset();
            const file_lines:Array<string> = text.split('\n');
            let vendor_id:string, vendor_name:string;
            let product_id:string, product_name:string;
            let processed_vendor_id:number;
            for(let i = 0; i<file_lines.length; i++) {
                const line = file_lines[i];
                if(line[0] == '#') {
                    if(line.toLowerCase().indexOf('list of known device') > -1)
                        break;
                } else {
                    if(line.length > 5)
                        data.addExepectedForProcessingRow(line);
                }
                if(isVendor(line)) {
                    [vendor_id, vendor_name] = extractVendor(line);
                    processed_vendor_id = parseInt(vendor_id, 16);
                    data.addVendor(new USBVendor(processed_vendor_id, vendor_name.trim()));
                }
                else if (isProduct(line)) {
                    [product_id, product_name] = extractProduct(line);
                    data.addProduct(new USBProduct(parseInt(product_id, 16, ), product_name.trim(), processed_vendor_id));
                }
                
            }
            return data;
    });
} 

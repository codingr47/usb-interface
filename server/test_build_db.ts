import {expect} from 'chai';
import { getUSBDatasetFromUSBDB } from './utils/USBDBGeneratorUtils';
import USBDataset from '../common/model/USBDataset';
const fs = require("fs");
//const path = require("path");


const createWriteFile = (file_name:string, data:string) => {
    fs.writeFileSync(`${__dirname}/${file_name}`, data, {encoding:'utf8', flag: 'w'});
};
const dirExists = (dir_name:string) => {
    console.log(`${__dirname}/${dir_name}`);
    return fs.existsSync(`${__dirname}/${dir_name}`);
};
const mkdir = (dir_name:string) => {
    return fs.mkdirSync(dir_name);
}

let dataset:USBDataset;
describe("is USB Database exported properly", () => {
    it('sum of products and vendors should be equal to expected rows', async () => { 
        dataset = await getUSBDatasetFromUSBDB();
        const products = dataset.products.length;
        const vendors  = dataset.vendors.length;
        const expected_rows = dataset.expected_rows.length;
        expect(expected_rows).to.equal( (products+vendors));
    });
}).afterAll(function() {
    if(this.test.parent.tests[0].state === "passed") {
        const vendors = {};
        const products = {};
        for(let i = 0; i<dataset.vendors.length; i++)
            vendors[dataset.vendors[i].id] = dataset.vendors[i];
        for(let i = 0; i<dataset.products.length; i++)
            products[dataset.products[i].id] = dataset.products[i]; 
        const dbExists = dirExists('db');
        console.log('dbexists', dbExists);
        if(!dbExists)
            mkdir('server/db');
        createWriteFile("db/vendors.json", JSON.stringify(vendors));
        createWriteFile("db/products.json", JSON.stringify(products));

    }
});
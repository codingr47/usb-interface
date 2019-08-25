/**
 * This script is a running point of the server-side part.
 * it has several dependencies - mocha, node-ts
 */
 const DB_FILES = ['db/products.json', 'db/vendors.json'];

 const { access, F_OK } = require("fs");
 const { spawnSync } = require("child_process");

 const filesExist = async (files) => { 
    const promises = [];
    for(let i in files)
        promises.push(new Promise  ((resolve, reject) => { 
        access(`${__dirname}/${files[i]}`, F_OK, (err) => {
            if(err)
                return reject(err);
            return resolve(true);
        });
    }));
    return Promise.all(promises);
 };


 const run = async() => {
    console.log("Checking if DB Was already generated");
    try {
        await filesExist(DB_FILES);
        console.log("DB Was already generated, moving on");
    }
    catch(err) {
        console.log("Files do not exist, running test_build_db");
        spawnSync('mocha', ['-r', 'ts-node/register', 'server/test_build_db.ts'], {stdio:'inherit'});
    }
    spawnSync("ts-node", ['server/server.ts'], {stdio:'inherit'});
};
run();
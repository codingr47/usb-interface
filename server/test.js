/**
 * this is a test I did back in the begining, 
 * it contains the original descriptors of the API 
 * and general testing of the API
 */
const usb = require("usb");
const IN_MEMORY_DEVICES = [];
const getUSBDescriptorAsync = async (device, descriptorStart, descriptorEnd) => {
    const promises = [];
    for(let i = descriptorStart; i<=descriptorEnd; i++) {
        promises.push(new Promise (   (resolve, reject) => { 
            device.getStringDescriptor(i, function (error, data) { 
                if(error)
                    resolve('');
                else
                    return resolve(data);
        })}));
    }
    return Promise.all(promises);
}
const getUSBCapabilitiesAsync = async (device) => {
    return new Promise( (resolve) => { 
            device.getCapabilities( (error, capabilities) => {
               
                if(capabilities)
                    resolve(capabilities);
                else if(error)
                    resolve(null);
            })
    });
};

usb.getDeviceList().forEach( async device =>  {
    try {
        device.open();
        //console.log(getUSBDescriptorAsync(device, 1, 1));
        const descriptor = await getUSBDescriptorAsync(device, 1,4);
        const capabilities = await getUSBCapabilitiesAsync(device);
        const {busNumber, parent} = device; 
        const {idProduct, idVendor} =  device.deviceDescriptor;
        device.close();
        IN_MEMORY_DEVICES.push({ busNumber,
                productID:idProduct,
                vendorID:idVendor,
                descriptor,
                capabilities
        });
    }
    catch (err) {
        return {};
    }
});
setTimeout(function () { 
console.log(IN_MEMORY_DEVICES);
}, 3000);
const noble = require('@abandonware/noble');
const logger = require('./logger');

let writeCharacteristic;
let notifyCharacteristic;
let printer;

const commands = {
    retractPaper: {
        byte: 0xA0
    },
    feedPaper: {
        byte: 0xA1,
        options: {
            postPrintDefault: Buffer.from([250])
        }
    },
    print: {
        byte: 0xA2
    },
    getDeviceStatus: {
        byte: 0xA3,
        options: {
            get: Buffer.from([0x00])
        }
    },
    setQuality: {
        byte: 0xA4,
        options: {
            quality1: Buffer.from([0x31]),
            quality2: Buffer.from([0x32]),
            quality3: Buffer.from([0x33]),
            quality4: Buffer.from([0x34]),
            quality5: Buffer.from([0x35]),
            speed_thin:	Buffer.from([0x22]),
            speed_moderation: Buffer.from([0x23]),
            speed_thick: Buffer.from([0x25]),
        }
    },
    latticeControl: {
        byte: 0xA6,
        options: {
            printLattice: Buffer.from([0xAA, 0x55, 0x17, 0x38, 0x44, 0x5F, 0x5F, 0x5F, 0x44, 0x38, 0x2C]),
            finishLattice: Buffer.from([0xAA, 0x55, 0x17, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x17])
        }
    },
    getDeviceInfo: {
        byte: 0xA8,
        options: {
            get: Buffer.from([0x00])
        }
    },
    updateDevice: {
        byte: 0xA9
    },
    wifiSettings: {
        byte: 0xAA
    },
    flowControl: {
        byte: 0xAE
    },
    energyLevel: {
        byte: 0xAF,
        options: {
            low: Buffer.from([0x1F, 0x40]),
            medium: Buffer.from([0x2E, 0xE0]),
            high: Buffer.from([0x44, 0x5C]),
        }
    },
    speed: {
        byte:0xBD,
        options: {
            default: Buffer.from([0x23])
        }
    },
    drawingMode: {
        byte: 0xBE,
        options: {
            image: Buffer.from([0x00]),
            text: Buffer.from([0x01])
        }
    },
    printCompressed: {
        byte: 0xBF
    }
}

//TODO: Remove this, move to CRC8 lib
const crc8Table = [
    0x00, 0x07, 0x0e, 0x09, 0x1c, 0x1b, 0x12, 0x15, 0x38, 0x3f, 0x36, 0x31,
    0x24, 0x23, 0x2a, 0x2d, 0x70, 0x77, 0x7e, 0x79, 0x6c, 0x6b, 0x62, 0x65,
    0x48, 0x4f, 0x46, 0x41, 0x54, 0x53, 0x5a, 0x5d, 0xe0, 0xe7, 0xee, 0xe9,
    0xfc, 0xfb, 0xf2, 0xf5, 0xd8, 0xdf, 0xd6, 0xd1, 0xc4, 0xc3, 0xca, 0xcd,
    0x90, 0x97, 0x9e, 0x99, 0x8c, 0x8b, 0x82, 0x85, 0xa8, 0xaf, 0xa6, 0xa1,
    0xb4, 0xb3, 0xba, 0xbd, 0xc7, 0xc0, 0xc9, 0xce, 0xdb, 0xdc, 0xd5, 0xd2,
    0xff, 0xf8, 0xf1, 0xf6, 0xe3, 0xe4, 0xed, 0xea, 0xb7, 0xb0, 0xb9, 0xbe,
    0xab, 0xac, 0xa5, 0xa2, 0x8f, 0x88, 0x81, 0x86, 0x93, 0x94, 0x9d, 0x9a,
    0x27, 0x20, 0x29, 0x2e, 0x3b, 0x3c, 0x35, 0x32, 0x1f, 0x18, 0x11, 0x16,
    0x03, 0x04, 0x0d, 0x0a, 0x57, 0x50, 0x59, 0x5e, 0x4b, 0x4c, 0x45, 0x42,
    0x6f, 0x68, 0x61, 0x66, 0x73, 0x74, 0x7d, 0x7a, 0x89, 0x8e, 0x87, 0x80,
    0x95, 0x92, 0x9b, 0x9c, 0xb1, 0xb6, 0xbf, 0xb8, 0xad, 0xaa, 0xa3, 0xa4,
    0xf9, 0xfe, 0xf7, 0xf0, 0xe5, 0xe2, 0xeb, 0xec, 0xc1, 0xc6, 0xcf, 0xc8,
    0xdd, 0xda, 0xd3, 0xd4, 0x69, 0x6e, 0x67, 0x60, 0x75, 0x72, 0x7b, 0x7c,
    0x51, 0x56, 0x5f, 0x58, 0x4d, 0x4a, 0x43, 0x44, 0x19, 0x1e, 0x17, 0x10,
    0x05, 0x02, 0x0b, 0x0c, 0x21, 0x26, 0x2f, 0x28, 0x3d, 0x3a, 0x33, 0x34,
    0x4e, 0x49, 0x40, 0x47, 0x52, 0x55, 0x5c, 0x5b, 0x76, 0x71, 0x78, 0x7f,
    0x6a, 0x6d, 0x64, 0x63, 0x3e, 0x39, 0x30, 0x37, 0x22, 0x25, 0x2c, 0x2b,
    0x06, 0x01, 0x08, 0x0f, 0x1a, 0x1d, 0x14, 0x13, 0xae, 0xa9, 0xa0, 0xa7,
    0xb2, 0xb5, 0xbc, 0xbb, 0x96, 0x91, 0x98, 0x9f, 0x8a, 0x8d, 0x84, 0x83,
    0xde, 0xd9, 0xd0, 0xd7, 0xc2, 0xc5, 0xcc, 0xcb, 0xe6, 0xe1, 0xe8, 0xef,
    0xfa, 0xfd, 0xf4, 0xf3
];

/*
    data: buffer of data to send e.g [0x01, 0x02]
*/
function calcCRC8(data) {
    let crc = 0x00;
    data.forEach(b => {
        crc = crc8Table[crc ^ b & 0xFF];
    })
    return crc & 0xFF;
}

async function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

/*
    cmd:    command bit, e.g 0xA1
    data:   buffer of data to send e.g [0x01, 0x02]
*/
async function buildCommandMessage(cmd, data) {

    const startBits = Buffer.from([0x51, 0x78]); //Magic numbers, always 0x51, 0x78
    const command = Buffer.from([cmd]); //The command to send
    const zeroBit = Buffer.from([0x00]); //0x00, used for direction and a magic number
    const dataLen = Buffer.from([data.length]); //Length of the data to send
    const crcBuf = Buffer.from([calcCRC8(data)]); //CRC8 of the data to send
    const endBit = Buffer.from([0xFF]); //Magic number, alway 0xFF

    const buffers = [startBits, command, zeroBit, dataLen, zeroBit, data, crcBuf, endBit ];
    
    return Buffer.concat(buffers);
}

async function connectToPrinter(printerName, timeout) {
    logger.trace('Scanning for printer...');
    noble.startScanning(); 
    
    return new Promise((resolve, reject) => {

        const timer = setTimeout(() => {
            logger.error('Timed out connecting to printer!');
            reject(new Error("timeout"));
        }, timeout);

        noble.on('discover', async (peripheral) => {
            if(peripheral.advertisement.localName === printerName) {
                logger.trace('Printer found!');
                await noble.stopScanningAsync();
                await peripheral.connectAsync();
                logger.info('Connected to printer!');
                clearTimeout(timer);
                resolve(peripheral);   
            }
        });
})};


async function setCharacteristics(printer) {
    const all = await printer.discoverAllServicesAndCharacteristicsAsync();
    logger.trace('Discovering printer characteristics...');

    all.characteristics.forEach(c =>{
        if(c.uuid == 'ae01') {
            writeCharacteristic = c;
        }
        if(c.uuid == 'ae02') {
            notifyCharacteristic = c;
        }
    });

   /* if(!notifyCharacteristic || !writeCharacteristic) {
        
    }*/
}

async function setupListeners(notifyCharacteristic, writeCharacteristic) {
    logger.trace('Setting up event listeners');

    noble.on('warning', (message) => {
        logger.warn(message);
    });
    //Notification Characteristic, UID: AE02
    notifyCharacteristic.subscribe((er) => {
        if(er) {
            logger.error('Failed to subsribe to printer notifications, exiting');
           //process.exit(1);
        }
    })
    notifyCharacteristic.once('notify', (state) => {
        logger.trace(`Notification recieved from printer: ${state}`);
    });
    notifyCharacteristic.on('data', (data, isNotification) => {
        logger.trace(data, 'Raw data recieved from printer');
        //TODO: handle processing data
        //process.exit(0);
    });
    
    //Write Characteristic UID: AE01
    writeCharacteristic.once('write', () => {
        logger.trace('Wrote data to printer');
    });
    
}

module.exports = {

    /**
     * Connects to a printer over BLE
     * @param {String} deviceName - The devices advertised name (e.g GB01)
     * @param {integer} timeoutS - Time to wait in seconds before timing out
     * @returns {void}
     */
    connect: async function(deviceName, timeoutS) {
        //connect to printer, give name and timeout in ms
        printer =  await connectToPrinter(deviceName, (timeoutS*1000));
        //get our chars
        await setCharacteristics(printer);
        //setup event listeners
        await setupListeners(notifyCharacteristic, writeCharacteristic);
    },

    /**
     * Feeds paper out of the printer for x steps
     * @param {integer} steps - Number of steps to feed for
     * @returns {void}
     */
    feedPaper: async function(steps) {
        logger.info(`Ejecting paper for ${steps} steps`);
        const feed = await buildCommandMessage(commands.feedPaper.byte, Buffer.from([steps]))
        await writeCharacteristic.writeAsync(feed, true);
    },

    /**
     * Retracts paper in to the printer for x steps
     * @param {integer} steps - Number of retract to feed for
     * @returns {void}
     */
    retractPaper: async function(steps) {
        logger.info(`Retracting paper for ${steps} steps`);
        const retract = await buildCommandMessage(commands.retractPaper.byte, Buffer.from([steps]))
        await writeCharacteristic.writeAsync(retract, true);
    },

    /**
     * Requests device information
     * @returns {void}
     */
    getDeviceInfo: async function() {
        logger.info('Requesting printer info...');
        const info = await buildCommandMessage(commands.getDeviceInfo.byte, commands.getDeviceInfo.options.get);
        await writeCharacteristic.writeAsync(info, true)
    },

    /**
     * Requests device status
     * @returns {void}
     */
    getDeviceStatus: async function() {
        logger.info('Requesting printer status...');
        const status = await buildCommandMessage(commands.getDeviceStatus.byte, commands.getDeviceStatus.options.get)
        await writeCharacteristic.write(status, true);
    },
    
    /**
     * Prints a bitmap
     * @param {Object} imgData - An array of 48 byte buffers, 1 per line of the image.
     * @param {String} printMode - Flag to tell the printer if its text or an image
     * @param {Boolean} ipp - Flag to tell the printer its in IPP mode, determines behaviour at the end of a print (Exit for non IPP, Disconnect for IPP)
     * @returns {void}
     */
    print: async function(imgData, printMode, ipp) {
        logger.info('Starting printing process!');

        //1, Set quality - 0x33
        logger.trace(`Setting quality to ${commands.setQuality.options.quality3}`);
        const quality = await buildCommandMessage(commands.setQuality.byte, commands.setQuality.options.quality3);
        await writeCharacteristic.writeAsync(quality, true);

        //2. do lattice magic
        logger.trace('Performing initial lattice magic');
        const lattice = await buildCommandMessage(commands.latticeControl.byte, commands.latticeControl.options.printLattice);
        await writeCharacteristic.writeAsync(lattice, true);

        //3. set energy
        logger.trace(`Setting energy to ${commands.energyLevel.options.high}`);
        const energy = await buildCommandMessage(commands.energyLevel.byte, commands.energyLevel.options.high);
        await writeCharacteristic.writeAsync(energy, true);

        //4. set drawing mode
        logger.trace(`Setting drawing mode to ${printMode}`);
        const drawingMode = printMode === 'image' ?  commands.drawingMode.options.image :  commands.drawingMode.options.text;
        const mode = await buildCommandMessage(commands.drawingMode.byte,drawingMode);
        await writeCharacteristic.writeAsync(mode, true);
        
        //5.set feed speed
        logger.trace(`Setting feed speed to ${commands.speed.options.default}`);
        const speed = await buildCommandMessage(commands.speed.byte, commands.speed.options.default); //TODO: move to config
        await writeCharacteristic.writeAsync(speed, true);

        //6. print the image, sleep 10ms between lines so the printer doesn't get overwhelmed
        logger.trace(`Printing image!, has ${imgData.length} lines`);
        for (let i = 0; i < imgData.length; i++) {
            const imgline = await buildCommandMessage(commands.print.byte, imgData[i]);            
            await writeCharacteristic.writeAsync(imgline, true);
            await sleep(10);
        }

        const feed = await buildCommandMessage(commands.feedPaper.byte, Buffer.from([100]))
        await writeCharacteristic.writeAsync(feed, true);

        //7. finish lattice
        logger.trace('Performing final lattice magic');
        const finish = await buildCommandMessage(commands.latticeControl.byte, commands.latticeControl.options.finishLattice);
        await writeCharacteristic.writeAsync(finish, true);

        logger.info('Printing complete!');

        //disconnect when finished
        await printer.disconnectAsync();
        if(!ipp) {
            process.exit(0);
        }
    }

}
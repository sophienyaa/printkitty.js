#!/usr/bin/env node

const printer = require('./printer');
const image = require('./image');
const text = require('./text');
const cli = require('./cli');
const logger = require('./logger');
const args = cli.args;

async function main() {

    await printer.connect(args.devicename, args.timeout);
    
    try {
        if(args.getinfo) {
            await printer.getDeviceInfo()
        }
        if(args.getstatus) {
            await printer.getDeviceStatus();
        }
        if(args.eject) {
            await printer.feedPaper(args.eject);
        }
        if(args.retract) {
            await printer.retractPaper(args.retract);
        }
        if(args.image) {
            const toPrint = await image.process(args.image);
            await printer.print(toPrint, 'image');
        }
        if(args.text) {
            const toPrint = await text.processText(args.text, args.font, args.fontsize);
            await printer.print(toPrint, 'text');
        }
    }
    catch(e) {
        logger.error(e, 'Oh noes!');
        process.exit(1);
    }
}

main();

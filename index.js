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
            await printer.printImage(toPrint);
        }
        if(args.text) {
            const toPrint = await text.printText(args.text, args.font, args.fontsize);
            await printer.printImage(toPrint);
        }
    }
    catch(e) {
        logger.error(e, 'Oh noes!');
        process.exit(1);
    }
}

main();

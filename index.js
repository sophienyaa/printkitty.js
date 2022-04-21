const printer = require('./printer');
const image = require('./image');
const cli = require('./cli');
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
            //await process.exit(0);
        }
        if(args.retract) {
            await printer.retractPaper(args.retract);
        }
        if(args.image) {
            const toPrint = await image.process(args.image);
            await printer.printImage(toPrint);
        }
        if(args.text) {
            console.log('This isnt yet impelemted :( ');
            //TODO: implement this!
        }
    }
    catch(e) {
        //TODO: loging!
        process.exit(1);
    }
}

main();
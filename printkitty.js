#!/usr/bin/env node

require('dotenv').config()
const printer = require('./printer');
const image = require('./image');
const text = require('./text');
const cli = require('./cli');
const logger = require('./logger');
const ipp = require('./ipp');
const http = require('./http');
const sms = require('./sms');

const args = cli.args;

async function main() {

    try {

        if(args.ipp) {
           //IPP / Postscript mode, so don't connect to the printer right away
           await ipp.listenForPrintJobs();
        }
        else if(args.http) {
            //HTTP Mode, used for controlling the printer via its REST API
            await http.listen();
        }
        else if(args.sms) {
            //SMS Mode, used for controlling the printer with printkitty-sms-service
            await sms.poll(args.smspoll);
        }
        else {
            await printer.connect(args.devicename, args.timeout);

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

    }
    catch(e) {
        logger.error(e, 'Oh noes!');
        process.exit(1);
    }
}

main();

const fs = require('fs')
const util = require('util');
const nonPrivate = require('non-private-ip')
const logger = require('./logger');
const url = require('url')
const Printer = require('ipp-printer');
const catPrinter = require('./printer');
const image = require('./image');
const childProcess = require('child_process');
const cli = require('./cli');

const exec = util.promisify(childProcess.exec);
const args = cli.args;
const ip = nonPrivate() || nonPrivate.private()
const config = { name: 'Cat Printer uwu', dir: process.cwd(), port: 3000}
const printer = new Printer(config)

module.exports = {

    /**
     * Listens for print and handles jobs over IPP.
     * @return {void}
     */
    listenForPrintJobs: async function() {

        logger.info('Starting in IPP / PS Mode...');

        printer.server.on('listening',  () => {
            logger.info(`Cat printer listening on: ${url.format({protocol: 'http', hostname: ip, port: config.port})}`);
        })

        printer.on('job', async (job) => {
            logger.info(`Print job received! : Id: ${job.Iid} Name:${job.name}`);

            const filename = 'job-' + job.id + '.ps' // .ps = PostScript
            const file = fs.createWriteStream(filename)

            job.pipe(file);
          
            job.on('end', async () => {
                logger.info(`Print job saved as: ${filename}`);

                logger.trace('Running ghostscript to convert to PNG...');

                //step 1, PS -> PNG with ghostscript
                //TODO: find a way to make this less shit!
                await exec(
                    `gs -dSAFER -dBATCH -dNOPAUSE -sDEVICE=pngmono -sOutputFile=${filename}.png ${filename}`
                );
                
                //Step 2, convert to format for printer
                logger.trace(`Connecting to cat printer ${args.devicename}...`);
                await catPrinter.connect(args.devicename, args.timeout);

                //Step 3, print as normal
                const toPrint = await image.process(`${filename}.png`, true);
                await catPrinter.print(toPrint, 'image', true);

                //Step 4, delete temp files
                logger.trace('Cleaning up temp files...');
                await exec(
                    `rm ${filename} && rm ${filename}.png`
                )
            })
        })
    }
}

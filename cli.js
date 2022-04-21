const yargs = require('yargs');

const argv = yargs
    .option('image', {
        alias: 'i',
        description: 'Path to the image you want to print (e.g ~/folder/image.png)',
        type: 'string',
    })
    .option('text', {
        alias: 't',
        description: 'Text you want to print, default font is Arial, 20pt',
        type: 'string',
    })
    .option('font', {
        alias: 'f',
        description: 'The font family to use (e.g Comic Sans)',
        type: 'string',
        default: 'arial'
    })
    .option('size', {
        alias: 's',
        description: 'The font size to use (e.g 16)',
        type: 'integer',
        default: 20
    })
    .option('getinfo', {
        alias: 'g',
        description: 'Returns printer info in hex',
        type: 'boolean',
    })
    .option('getstatus', {
        alias: 'u',
        description: 'Returns printer info in hex',
        type: 'boolean',
    })
    .option('eject', {
        alias: 'e',
        description: 'Ejects a number of lines of paper (e.g 50)',
        type: 'integer',
    })
    .option('retract', {
        alias: 'r',
        description: 'Retracts the paper by a number of lines (e.g 50)',
        type: 'integer',
    })
    .option('devicename', {
        alias: 'n',
        description: 'The name of your cat printer (e.g GT01)',
        type: 'string',
        default: 'GB01'
    })
    .option('timeout', {
        alias: 'o',
        description: 'Time in seconds to wait before aborting, when connecting to the printer (e.g 10)',
        type: 'integer',
        default: 5
    })
    .option('loglevel', {
        alias: 'l',
        description: 'Logging level to use, values are trace, debug, info, warn, error, fatal. Defaults to error',
        type: 'string',
        default: 'info'
    })
    .choices('loglevel', ['trace', 'debug', 'info', 'warn', 'error', 'fatal'])
    .help()
    .alias('help', 'h')
    .epilogue('For more information, check out the project repository at https://github.com/mickwheelz/printkitty.js ~nyaa')
    .env('PRINTKITTY')
    .demandOption('devicename', 'You must specify a device')
    //.demandOption('image', 'You must specify a image filename')

    .wrap(yargs.terminalWidth())
    .argv;

module.exports = {
    args: argv
};
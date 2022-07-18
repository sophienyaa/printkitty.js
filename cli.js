const yargs = require('yargs');

const argv = yargs
    .option('image', {
        alias: 'i',
        description: 'Path to the image you want to print (e.g ~/folder/image.png)',
        type: 'string',
    })
    .option('ipp', {
        alias: 'p',
        description: 'Run in IPP/Postscript mode, exposes a generic PS printer you can use from any app',
        type: 'boolean',
    })
    .option('http', {
        description: 'Run in HTTP mode, exposes API for printing',
        type: 'boolean',
    })
    .option('sms', {
        description: 'Run in SMS mode, polls printkitty-sms-service for SMS to print, provide the base url for the service',
        type: 'string',
    })
    .option('smsuser', {
        description: 'username for the printkitty-sms-service',
        type: 'string',
    })
    .option('smspassword', {
        description: 'password for the printkitty-sms-service',
        type: 'string',
    })
    .option('smspoll', {
        description: 'Frequency in seconds to poll for new SMS messages',
        type: 'integer',
        default: 10
    })
    .option('ippname', {
        alias: 'q',
        description: 'Name to broadcast when in IPP/PS Mode (e.g "kitty")',
        type: 'string',
        default: 'cat printer uwu'
    })
    .option('text', {
        alias: 't',
        description: 'Text you want to print in quotes, default font is Arial, 20px (e.g "hello world")',
        type: 'string',
    })
    .option('font', {
        alias: 'f',
        description: 'The font to use in quotes, this must be provided as it exists on your machine (e.g "Comic Sans MS")',
        type: 'string',
        default: 'arial'
    })
    .option('fontsize', {
        alias: 's',
        description: 'The font size to use, in pixels high (e.g 16)',
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
    .wrap(yargs.terminalWidth())
    .check((argv) => {
        if (!argv.ipp & !argv.image && !argv.text && !argv.eject && !argv.retract && !argv.getinfo && !argv.getstatus && !argv.http && !argv.sms ) {
          throw new Error("Oh Noes! You must specify a task to perform, e.g --image <image>, --eject 20")
        } else {
          return true
        }
      })
    .argv;

module.exports = {
    args: argv
};

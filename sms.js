const axios = require('axios')
const printer = require('./printer');
const text = require('./text');
const cli = require('./cli');
const logger = require('./logger');

const args = cli.args;

const auth = {
    auth: {
        username: args.smsuser,
        password: args.smspassword
    }
}

async function pollForSMS() {
    logger.trace(`Polling for new SMSs...`)
    try {
        const pollResponse = await axios.get(`${args.sms}/getSMS/PENDING`, auth)
        
        if(pollResponse.status === 200) {
            logger.trace(`Got ${pollResponse.data.length} messages to process`)
            pollResponse.data.forEach(async (sms) => {
                let success = false;
                try {
                    const formattedSMS = formatSMSToPrint(sms, true)
                    logger.trace(`Printing: ${formattedSMS}`)
                    await printer.connect(args.devicename, args.timeout)
                    const toPrint = await text.processText(formattedSMS, args.font, args.fontsize)
                    await printer.print(toPrint, 'text', true)
                    success = true
                } catch (e) {
                    logger.error(e)
                }
                await updateSMSRecord(sms,success)
            })
        }
        else {
            throw `Failed to poll for SMSs, code ${pollResponse.code}`
        }
    }
    catch(e) {
        logger.error(e)
        process.exit(1);
    }
}

function formatSMSToPrint(sms, mask) {
    let fromNumber = sms.from;
    if(mask) {
        const ccode = fromNumber.substring(0,4);
        const endtwo = fromNumber.substring(fromNumber.length-2, fromNumber.length);
        const padding = ''.padEnd(fromNumber.length-6, '*')
        fromNumber = `${ccode}${padding}${endtwo}`
    }
    return `From: ${fromNumber} Msg: ${sms.msg}`
}

async function updateSMSRecord(record, success) {
    const updateResponse = await axios.post(`${args.sms}/updateSMSStatus/${record._id}`,{status: success ? 'COMPLETE' : 'ERROR'}, auth)
    if (updateResponse.status !== 200) {
        throw `Failed to update SMS record, code: ${updateResponse.code}`
    }
}

module.exports = {

    /**
     * Poll the printkitty-sms-service for SMS to process
     * @return {void}
     */
    poll: async function(freq) { 
        const loop = setInterval(async () => {
            await pollForSMS()
        }, freq*1000);
   }
}

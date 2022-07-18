const express = require('express')
const bodyParser = require('body-parser');
const printer = require('./printer');
const text = require('./text');
const cli = require('./cli');
const logger = require('./logger');

const args = cli.args;
const port = 6969;

const app = express()
app.use(bodyParser.json());

module.exports = {

    /**
     * Listens for print and handles jobs over HTTP.
     * @return {void}
     */
    listen: async function() { 

        app.post('/printText', async (req, res) => {
            try {
                await printer.connect(args.devicename, args.timeout);
                const toPrint = await text.processText(req.body.text, req.body.font, req.body.fontsize);
                await printer.print(toPrint, 'text', true);
                res.sendStatus(200)
                res.send('OK!')
            } catch(e) { //TODO: improve this, so can error on incorrect req etc
                logger.error(e)
                res.sendStatus(500)
                res.send(JSON.stringify(e))
            }    
        })
        
        app.listen(port, () => {
            logger.info(`Server started, listening on port ${port}`);
        })

   }
}
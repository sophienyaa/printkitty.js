const floydSteinberg = require('floyd-steinberg');
const sharp = require('sharp');
const logger = require('./logger');

async function buildBMP(img) {

    let imgArray = [];
    let buffctr = 0
    //loop over each line
    for (let y = 0; y < img.info.height; y++) {
        //loop over each pixel in each line
        let xArr = Array.from('0'.repeat(384));
        for(let x = 0; x < img.info.width; x++ ) {

            let bit = '1';
            if(img.data[buffctr] == 0xFF) {
                bit = '0';
            }

            xArr[x] = bit;
            buffctr++;
        }

        const result = xArr.join("").match(/.{1,8}/g) || [];
        let xBuff = Buffer.alloc(48);
        result.forEach((bit, idx) => {
            let rev = bit.split("").reverse().join("");
            xBuff[idx] = parseInt(rev, 2);
        })
        imgArray.push(xBuff);
    }
    return imgArray;
}

async function processImage(fileName) {
    logger.info(`Processing image ${fileName}...`);
    const monoImage = await sharp(fileName)
                        .resize(384)
                        .flatten({ background: '#FFFFFF' })
                        .modulate({
                            brightness:1
                        })
                        .raw()
                        .toBuffer({ resolveWithObject: true })
                        .then(raw => {
                            return floydSteinberg(raw)
                        });
               
    logger.trace('Image converted to monochrome, 384px wide...');
    return await sharp(monoImage.data, {raw:{
                            width: monoImage.info.width,
                            height: monoImage.info.height,
                            channels: monoImage.info.channels
                        }})
                        .raw()
                        .extractChannel('green')
                        .toBuffer({ resolveWithObject: true });
}

module.exports = {
    process: async function(fileName) {
        const processed = await processImage(fileName);
        logger.trace('Formatting image for printing...');
        return await buildBMP(processed);
    }
}
const floydSteinberg = require('floyd-steinberg');
const sharp = require('sharp');
const logger = require('./logger');

/**
 * Processes an image file into 384px wide, monochrome image to be converted to a bitmap
 * @param {string} fileName - The filename and path to the image to process
 * @param {string} skipFS - Flag to skip dithering, used when image is already monochrome
 * @return {Object} An object containing the image as a buffer, and info about it
 */
async function processImage(fileName,skipFS) {
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
                            if(!skipFS) {
                                return floydSteinberg(raw)
                            }
                            return raw;
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

    /**
     * Processes an image file into a bitmap the printer supports
     * @param {string} fileName - The filename and path to the image to process
     * @param {string} skipFS - Flag to skip dithering, used when image is already monochrome
     * @return {Array} An array of 48 byte buffers, 1 per line of the image
     */
    process: async function(fileName, skipFS) {
        const processed = await processImage(fileName, skipFS);
        logger.trace('Formatting image for printing...');
        return await this.buildBMP(processed);
    },

    /**
     * Processes a raw image into a bitmap the printer supports
     * @param {Object} img - The image object, .data contains a buffer of raw pixels and .info contains image info e.g dimensions
     * @return {Array} An array of 48 byte buffers, 1 per line of the image
     */
    buildBMP: async function(img) {
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
}

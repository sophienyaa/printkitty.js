var floydSteinberg = require('floyd-steinberg');
const sharp = require('sharp');
const printer = require('./printer');

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


async function main() {


    /*const img1 = await sharp('grumpy-fs.png').resize(100).raw().toBuffer();

    const image = await sharp(img1.data, {
        raw: {
            width: 100,
            height: 100,
            channels: 4
        }
    });*/

        const imgReady = await  sharp('pls.png').resize(384).raw().flatten({ background: '#FFFFFF' }).extractChannel('green').toBuffer({ resolveWithObject: true });

        //console.log(imgReady);

        const imgArray = await buildBMP(imgReady);

        console.log(imgArray);

    
        await printer.connect();
    
        await printer.printImage(imgArray);
}

main();




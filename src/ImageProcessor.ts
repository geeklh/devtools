import * as fs from 'fs';
import * as path from 'path';
const PNG = require('pngjs').PNG;
var jpeg = require('jpeg-js'); //https://www.npmjs.com/package/jpeg-js

export async function pngToJpeg() {
    const dirname = 'C:/Users/18571/Documents/work/EgretProject/sg123/sanguo/resource/2d/external/icon/skill'
    const files = fs.readdirSync(dirname);
    for (let file of files) {
        const pngFilename = path.join(dirname, file)
        const outputFilename = pngFilename.replace(".png", ".jpg");
        await convertSingle(pngFilename, outputFilename);
        fs.unlinkSync(pngFilename);
    }
}

function convertSingle(inputFilename: string, outputFilename: string) {
    return new Promise((resolve, reject) => {
        fs.createReadStream(inputFilename)
            .pipe(new PNG({
                filterType: 4
            }))
            .on('parsed', function () {

                let imageData: ImageData = this;

                console.log(imageData.width);
                console.log(imageData.height)
                var jpegImageData = jpeg.encode(imageData, 50);
                fs.createWriteStream(outputFilename).write(jpegImageData.data, (error) => {
                    console.log(error)
                    resolve();
                })
                // this.pack().pipe(fs.createWriteStream('out.png'));
            });
    })
}


/**
 * 
 * @param dirname 要检查的文件夹
 * @returns 不符合规定的文件列表
 */
export async function checkImage(dirname: string, onProgress: (current: number, total: number) => void) {
    const result = [];
    const files = fs.readdirSync(dirname);
    const total = files.length;
    let current = 0;
    for (let file of files) {
        current++;
        onProgress(current, total);
        const pngFilename = path.join(dirname, file);
        if (pngFilename.indexOf(".png") >= 0) {
            const data = await getSize(pngFilename);
            if (data.width != 90 || data.height != 90) {
                result.push(file);
            }
        }
    }
    return result;
}


function getSize(inputFilename: string) {
    return new Promise<ImageData>((resolve, reject) => {
        fs.createReadStream(inputFilename)
            .pipe(new PNG({
                filterType: 4
            }))
            .on('parsed', function () {

                let imageData: ImageData = this;
                resolve(imageData);
                // this.pack().pipe(fs.createWriteStream('out.png'));
            });
    })
}

export function draw(target: ImageData, source: ImageData, targetX: number, targetY: number) {
    let index = targetY * target.width * 4;
    for (let row = 0; row < source.height; row++) {
        const start = row * source.width * 4;
        const end = start + source.width * 4;
        const subarray = source.data.subarray(start, end);

        target.data.set(subarray, index + targetX * 4);
        index += target.width * 4;
    }
}

export function createImageData(width: number, height: number) {
    return { width, height, data: new Uint8ClampedArray(width * height * 4) }
}

export function encodeJpg(imageData: ImageData, output: string) {

    var jpegImageData = jpeg.encode(imageData, 50);
    console.log(jpegImageData)
    fs.createWriteStream(output).write(jpegImageData.data, (error) => {
        console.log(error)
    })
}

export function encodePng(imageData: ImageData, output: string) {
    const png = new PNG();
    png.width = imageData.width;
    png.height = imageData.height;
    png.data = imageData.data;
    png.pack().pipe(fs.createWriteStream(output));
}


const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

export function removeBlankBorder(img: HTMLImageElement) {
    return new Promise<Result>((resolve, reject) => {

        canvas.width = img.width;
        canvas.height = img.height;

        context.drawImage(img, 0, 0);
        const imgBitmapData = context.getImageData(0, 0, canvas.width, canvas.height);
        const result = removeBlankBorder_1(imgBitmapData);
        resolve(result);
    })
}


function getRealRect(imageData: ImageData) {

    function getLeft() {
        for (let x = 0; x < imageData.width; x++) {
            for (let y = 0; y < imageData.height; y++) {
                const idx = (imageData.width * y + x) << 2;
                const alpha = imageData.data[idx + 3];
                if (alpha > 0) {
                    return x;
                }
            }
        }
        return 0;
    }

    function getRight() {
        for (let x = imageData.width - 1; x >= 0; x--) {
            for (let y = 0; y < imageData.height; y++) {
                const idx = (imageData.width * y + x) << 2;
                const alpha = imageData.data[idx + 3];
                if (alpha > 0) {
                    return x + 1;
                }
            }
        }
        return imageData.width;
    }

    function getTop() {
        for (let y = 0; y < imageData.height; y++) {
            for (let x = 0; x < imageData.width; x++) {
                const idx = (imageData.width * y + x) << 2;
                const alpha = imageData.data[idx + 3];
                if (alpha != 0) {
                    // filledLine.push(y);
                    return y;
                }
            }
        }
        return 0;
    }

    function getBottom() {
        for (let y = imageData.height - 1; y >= 0; y--) {
            for (let x = 0; x < imageData.width; x++) {
                const idx = (imageData.width * y + x) << 2;
                const alpha = imageData.data[idx + 3];
                if (alpha != 0) {
                    // filledLine.push(y);
                    return y + 1;
                }
            }
        }
        return imageData.height;
    }

    const x = getLeft();
    const y = getTop();
    const width = getRight() - x;
    const height = getBottom() - y;
    if (width == 0 || height == 0) {
        return { x: 0, y: 0, width: 2, height: 2 }
    }
    return {
        x, y, width, height
    }
}

export function clipImageData(source: ImageData, x: number, y: number, width: number, height: number) {
    const newImageData = new Uint8ClampedArray(width * height * 4);
    let index = 0;
    const img = {
        width,
        height,
        data: newImageData
    }
    for (let row = y; row < height + y; row++) {
        const start = row * source.width * 4 + x * 4;
        const end = start + width * 4;
        const subarray = source.data.subarray(start, end);
        newImageData.set(subarray, index);
        index += width * 4;
    }
    return img;
}

function removeBlankBorder_1(imageData: ImageData): Result {
    const result = getRealRect(imageData);

    const newImageData = new Uint8ClampedArray(result.width * result.height * 4);
    let index = 0;
    const img = {
        width: result.width,
        height: result.height,
        x: result.x,
        y: result.y,
        data: newImageData
    }
    for (let row = result.y; row < result.height + result.y; row++) {
        const start = row * imageData.width * 4 + result.x * 4;
        const end = start + result.width * 4;
        const subarray = imageData.data.subarray(start, end);
        newImageData.set(subarray, index);
        index += result.width * 4;
    }
    return img;
}

type Result = { x: number, y: number, width: number, height: number, data: Uint8ClampedArray }


export function createImage(width: number, height: number, callback: (context: CanvasRenderingContext2D) => void) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d")!;
    callback(context);
    return context.getImageData(0, 0, canvas.width, canvas.height);

}
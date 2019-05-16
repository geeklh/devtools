import * as path from 'path';
import { removeBlankBorder } from './ImageProcessor';

// 选择文件夹
export function selectDir() {
    return new Promise<string>((resolve, reject) => {
        const { dialog } = require('electron').remote;
        dialog.showOpenDialog({
            properties: ['openDirectory']
        }, async function (filePaths) {
            console.log(filePaths, "检测信息输出");
            if (filePaths && filePaths[0]) {
                resolve(filePaths[0])
            }
            else {
                resolve(null);
            }
        })
    })
}
// 选择文件
export function selectFile() {
    return new Promise<string>((resolve, reject) => {
        const { dialog } = require('electron').remote;
        dialog.showOpenDialog({
            properties: ["openFile"]
        }, async function (filePaths) {
            console.log(filePaths, "打开文件");
            if (filePaths && filePaths[0]) {
                resolve(filePaths[0])
            }
            else {
                resolve(null);
            }
        })
    })
}

export function loadTexture(url: string, name: string) {
    return new Promise<Texture>((resolve, reject) => {
        const img = document.createElement("img");
        img.src = url;
        img.crossOrigin = '';
        img.onload = async () => {
            const texture = new Texture();
            texture.name = name;
            texture.bitmapData = img;
            texture.alias = parseInt(path.basename(url).replace(".png", "")).toString();
            const imageData = await removeBlankBorder(img);
            texture.rawData = imageData;
            resolve(texture);

        }
    })
}

export class Texture {

    alias: string
    name: string;
    bitmapData: HTMLImageElement;
    rawData: {
        x: number, y: number, width: number, height: number, data: Uint8ClampedArray
    }
}
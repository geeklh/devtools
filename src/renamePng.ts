import * as fs from 'fs';


let files = fs.readdirSync('./');

for (let fileName of files) {
    let arr1 = fileName.split('.');
    let fileNameStr: string = arr1[0];
    let aaa = arr1[1];
    if (aaa == 'js') {
        continue;
    }
    let arr2 = fileNameStr.split('_');
    let numStr = arr2[1];
    let num = parseInt(numStr);
    let newFileName = `${Math.floor((num - 1) / 8)}_${(num - 1) % 8}.png`;
    fs.renameSync(fileName, newFileName);
}
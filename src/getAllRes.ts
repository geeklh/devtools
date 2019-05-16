import * as fs from 'fs';

let result = [];

let getAllFile = (dirPath: string) => {
    let files = fs.readdirSync(dirPath);
    // console.log(files);
    // files.foreach((item, index) => {
    for (let item of files) {
        let localFilePath = dirPath + "/" + item;
        // console.log('')
        let stat = fs.statSync(localFilePath);
        if (stat.isDirectory()) {
            let newDirPath = localFilePath;
            getAllFile(newDirPath);
        } else {
            if (item.indexOf("png") >= 0 || item.indexOf("jpg") >= 0 || item.indexOf("json") >= 0) {
                if (item.indexOf("output.png") >= 0) {
                    break;
                } else {
                    let filePath = localFilePath;
                    result.push(filePath);
                }
            }
        }
    }
    // });
}


getAllFile('./');
let resultPath = './result.json';
console.log(result);
fs.writeFileSync(resultPath, JSON.stringify(result));
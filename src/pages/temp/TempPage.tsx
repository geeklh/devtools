import React from "react";
import { FileSystemTree } from "../../project/FileSystemTree";
import { loadTexture } from "../../Utils";
import { appSettings } from "../settings/Settings";
import { clipImageData, encodePng, encodeJpg } from "../../ImageProcessor";
import * as path from 'path';
import * as fs from 'fs';

export default class TempPage extends React.Component {

    render() {
        return (
            <FileSystemTree root="三国资源整理/Z-战斗场景/B-背景图" onSelected={async (value) => {
                // console.log(value)
                value = value.replace(appSettings.get("project.root"), "");
                // console.log(value)
                const texture = await loadTexture("http://localhost:50000" + value, '11');

                const { width, height } = texture.rawData;
                console.log(texture.rawData,"获取当前加载图片的尺寸")
                const TILE_WIDTH = 512;
                const TILE_HEIGHT = 512;
                const row = height / TILE_WIDTH;
                const col = width / TILE_HEIGHT;
                const outputDir = path.join(appSettings.get("project.root"), path.dirname(value), path.basename(value.replace(path.extname(value), "")));
                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir);
                }
                for (let i = 0; i < col; i++) {
                    for (let j = 0; j < row; j++) {
                        const clipImage = clipImageData(texture.rawData, i * TILE_WIDTH, j * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
                        encodeJpg(clipImage, path.join(outputDir, `${i}_${j}.jpg`));
                    }
                }
            }} />
        )
    }
}
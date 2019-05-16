import { MaxRectBinPack, Rect } from 'bin-packing-core';
import * as fs from 'fs';
import * as path from 'path';
import { createImageData, draw, encodePng } from '../ImageProcessor';
import { AnimationModel, animationViewModel } from '../pages/animation/AnimationViewModel';

function test() {

}




export function createSpriteSheet2(models: Map<string, AnimationModel>, outputDir) {
    const usedTextureName = [];
    let rects1: Rect[] = [];
    let actions = {}

    for (let [name, model] of models) {
        for (var i = 0; i < model.frames.length; i++) {
            const current = model.frames[i];
            if (usedTextureName.indexOf(current.textureName) == -1) {
                usedTextureName.push(current.textureName)
            }
        }
        const frames = model.frames.map(item => {
            const { textureName, frameName } = item;
            return { textureName, frameName };
        });
        actions[name] = frames;
    }

    function getTextureByName(models: Map<string, AnimationModel>, textureName: string) {
        for (let model of models.values()) {
            const result = model.resources.find(texture => texture.name === textureName);
            if (result) {
                return result;
            }
        }
    }

    const usedTexture = usedTextureName.map((name) => getTextureByName(models, name));
    rects1 = rects1.concat(
        usedTexture.map(texture => {
            const rect = new Rect();
            rect.width = texture.rawData.width;
            rect.height = texture.rawData.height;
            rect.info = texture.rawData;
            rect.info.name = texture.name;
            return rect;
        })
    );
    const { imageData, rects } = executeMaxRect({ width: 2048, height: 2048 }, rects1);
    encodePng(imageData, path.join(outputDir, "release/output.png"));

    const spritesheet = rects.map(rect => {
        const width = rect.width;
        const height = rect.height;
        const x = rect.x;
        const y = rect.y;
        const offsetX = -rect.info.x;
        const offsetY = -rect.info.y;
        const name = rect.info.name;
        return { x, y, width, height, offsetX, offsetY, name };
    });

    const frameRate = 8;
    const anchor = animationViewModel.model.anchor;
    const scale = animationViewModel.model.scale;
    const outputJson = { spritesheet, actions, frameRate, anchor, scale };
    fs.writeFileSync(path.join(outputDir, "release/output.json"), JSON.stringify(outputJson, null, '  '));
}

export function createSpriteSheet(model: AnimationModel, outputDir: string) {

    function getTextureByName(model: AnimationModel, textureName: string) {
        return model.resources.find(texture => texture.name === textureName)
    }
    const usedTextureName = [];
    for (var i = 0; i < model.frames.length; i++) {
        const current = model.frames[i];
        if (usedTextureName.indexOf(current.textureName) == -1) {
            usedTextureName.push(current.textureName)
        }
    }
    const usedTexture = usedTextureName.map((name) => getTextureByName(model, name));
    const rects1 = usedTexture.map(texture => {
        const rect = new Rect();
        rect.width = texture.rawData.width;
        rect.height = texture.rawData.height;
        rect.info = texture.rawData;
        rect.info.name = texture.name;
        return rect;
    })
    const { imageData, rects } = executeMaxRect({ width: 2048, height: 2048 }, rects1);
    encodePng(imageData, path.join(outputDir, "release/output.png"));

    const spritesheet = rects.map(rect => {
        const width = rect.width;
        const height = rect.height;
        const x = rect.x;
        const y = rect.y;
        const offsetX = -rect.info.x;
        const offsetY = -rect.info.y;
        const name = rect.info.name;
        return { x, y, width, height, offsetX, offsetY, name };
    });
    const frames = model.frames.map(item => {
        const { textureName, frameName } = item;
        return { textureName, frameName };
    })
    const frameRate = 24;
    const anchor = model.anchor;
    const outputJson = { spritesheet, frames, frameRate, anchor };
    fs.writeFileSync(path.join(outputDir, "release/output.json"), JSON.stringify(outputJson, null, '  '));
}

function executeMaxRect(config: { width: number, height: number }, rects_1: Rect[]) {
    const { width, height } = config;
    const allowRotate = false;
    console.log(`容器：w:${width}  h:${height}`)
    const packer = new MaxRectBinPack(width, height, allowRotate);

    const findPosition = 0; // 参照第一条

    const rectsCopy = rects_1.map($ => $.clone());// js引用传递，这里直接操纵了传入的数组，所以传入一份clone的。
    const rects = packer.insertRects(rectsCopy, findPosition);
    if (rects.length !== rects_1.length) { // 插入失败，因为容器大小不足
        throw new Error('insert failed');
    } else { //插入成功
        const imageData = createImageData(config.width, config.height);
        for (let rect of rects) {
            const texture = rect.info;
            draw(imageData, texture, rect.x, rect.y);
        }
        return { imageData, rects };
    }
}

function update() {

}
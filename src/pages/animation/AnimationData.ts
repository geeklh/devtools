import { Modal, notification } from 'antd';
import { Rect } from 'bin-packing-core';
import { shell } from 'electron';
import * as fs from 'fs-extra-promise';
import { action, computed, observable } from 'mobx';
import * as path from 'path';
import { loading } from '../../component/LoadingComponent';
import { encodePng } from '../../ImageProcessor';
import { executeMaxRect } from '../../spritesheet/MaxRect';
import { loadTexture, Texture } from "../../Utils";
import { appSettings } from '../settings/Settings';
export interface AnimationFrameData {

    index: number;

    textureName: string;

    frameName: string;

}

type FrameConfig = {
    textureName: string,
    frameName: string,
    index: number
}

type LegacyActionConfig = {
    textures: FrameConfig[],
    resources: string[],
    anchor: { x: number, y: number }
}

type ActionConfig = {
    [index: string]: FrameConfig[]
}

type AnimationConfig = {
    actions: ActionConfig;
    resources: string[]
}

class AnimationModel {

    @observable
    frames: AnimationFrameData[] = [];


    @observable
    resources: Texture[] = [];
}


export class AnimationViewModel {




    model: AnimationModel = new AnimationModel();

    @observable
    currentIndex = 0;

    @observable
    selectedDirname: string;

    private dirname: string;

    private animationId = 0;

    @observable
    anchor: { x: number, y: number } = { x: 0, y: 0 };

    @computed
    get currentFrame() {
        return this.model.frames[this.currentIndex];
    }

    @computed
    get currentTexture() {
        return this.model.resources.find(item => item.name === this.model.frames[this.currentIndex].textureName)
    }

    @action
    removeAndUsePreviewFrame() {
        this.model.frames[this.currentIndex].textureName = this.model.frames[this.currentIndex - 1].textureName;
    }

    @action
    useFrame(frameIndex: number) {
        this.model.frames[this.currentIndex].textureName = this.model.resources[frameIndex].name;
    }

    @action
    previousFrame() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        }
    }

    @action
    nextFrame() {
        this.currentIndex++;
        if (this.currentIndex >= this.model.frames.length) {
            this.currentIndex = 0;
        }
    }


    getTextureByName(textureName: string) {
        return this.model.resources.find(texture => texture.name === textureName)
    }

    @action
    selectFrame(index: number) {
        this.currentIndex = index;
    }

    @computed
    get textureUsed() {
        const arr = [];

        for (var i = 0; i < this.model.frames.length; i++) {
            const current = this.model.frames[i];
            if (arr.indexOf(current.textureName) == -1) {
                arr.push(current.textureName)
            }

        }
        return arr.length;
    }

    @action
    openFolder() {
        if (this.dirname) {
            shell.showItemInFolder(this.dirname);
        }
    }

    @computed
    get isPlaying() {
        return this.animationId != 0;
    }

    private animationFrameCount = 0;

    @action
    play() {
        if (this.animationId == 0) {
            const update = () => {
                if (this.animationFrameCount++ % 2 == 0) {
                    this.nextFrame();
                }
                this.animationId = requestAnimationFrame(update);
            }
            this.animationId = requestAnimationFrame(update);
        }
    }

    @action
    save() {
        const frames = this.model.frames;
        const resources = this.model.resources.map((item) => item.name);
        const anchor = this.anchor
        const json: LegacyActionConfig = { textures: frames, resources, anchor };

        const text = JSON.stringify(json, null, '  ');

        fs.writeFileSync(path.join(this.dirname, "config.json"), text, "utf-8");
        notification.open({
            message: '保存成功',
            description: '保存成功',
            duration: 3
        });
    }

    @action
    exportTestFrame(): any {

        const copy = (outputDir: string) => {
            let index = 0;
            for (let texture of this.model.frames) {
                index++;
                const filename = `${index}.png`;
                fs.copyFileSync(path.join(this.dirname, texture.textureName), path.join(outputDir, filename))
            }
            notification.open({
                message: '保存成功',
                description: '保存成功',
                duration: 3
            }
            );
        }

        const key = "testFrame.output"
        let v = appSettings.get(key);
        if (v) {
            copy(v);

        }
        else {
            const modal = Modal.error({
                title: "需要设置导出路径", onOk: async () => {
                    v = await appSettings.setFolder(key);
                    modal.destroy();
                    copy(v);
                }
            })
        }
    }

    @action
    stop() {
        this.currentIndex = 0;
        cancelAnimationFrame(this.animationId);
        this.animationId = 0;
        this.animationFrameCount = 0;
    }

    @action
    release() {
        const releaseDir = path.join(this.dirname, "release/");
        if (!fs.existsSync(releaseDir)) {
            fs.mkdirSync(releaseDir);
        }
        const usedTextureName = [];
        for (var i = 0; i < this.model.frames.length; i++) {
            const current = this.model.frames[i];
            if (usedTextureName.indexOf(current.textureName) == -1) {
                usedTextureName.push(current.textureName)
            }
        }
        const usedTexture = usedTextureName.map((name) => this.getTextureByName(name));
        const rects1 = usedTexture.map(texture => {
            const rect = new Rect();
            rect.width = texture.rawData.width;
            rect.height = texture.rawData.height;
            rect.info = texture.rawData;
            rect.info.name = texture.name;
            return rect;
        })
        const { imageData, rects } = executeMaxRect({ width: 2048, height: 2048 }, rects1);
        encodePng(imageData, path.join(this.dirname, "release/output.png"));

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
        const frames = this.model.frames.map(item => {
            const { textureName, frameName } = item;
            return { textureName, frameName };
        })
        const frameRate = 60;
        const anchor = this.anchor;
        const outputJson = { spritesheet, frames, frameRate, anchor };
        fs.writeFileSync(path.join(this.dirname, "release/output.json"), JSON.stringify(outputJson, null, '  '));
    }

    @action
    async releaseAll() {
        const projectRoot = appSettings.get("project.root");
        const dirname = path.join(projectRoot, this.selectedDirname);
        const files = fs.readdirSync(dirname).filter(item => {
            const subdirname = path.join(dirname, item);
            const stats = fs.statSync(subdirname);
            if (stats.isDirectory()) {
                const releaseDir = path.join(subdirname, 'release');
                if (fs.existsSync(releaseDir)) {
                    return true;
                }
            }
            return false;
        });
        const reporter = loading();
        let index = 0;
        const total = files.length;
        for (let item of files) {
            const dir = path.join(dirname, item);

            await fs.copyAsync(path.join(dir, "release"), `./temp/${item}`);
            index++;
            reporter.onProgress(index, total)
        }


    }

    async init(relativeDirName: string) {
        const projectRoot = appSettings.get("project.root");
        this.dirname = path.join(projectRoot, relativeDirName);
        const files = fs.readdirSync(this.dirname)
            .filter((item) => item.indexOf('.png') >= 0)
            .map(item => `http://localhost:50000${relativeDirName}/${item}`);
        const textures: Texture[] = [];
        for (let i = 0; i < files.length; i++) {
            const item = files[i];
            textures.push(await loadTexture(item, i.toString()));
        }
        // const textures = await Promise.all(files.map((item, index) => loadTexture(item, index.toString())))
        const configFilename = path.join(this.dirname, "config.json");
        this.model = new AnimationModel();
        if (fs.existsSync(configFilename)) {
            const text = fs.readFileSync(configFilename, 'utf-8');
            const json = JSON.parse(text) as LegacyActionConfig;
            this.model.frames = json.textures;
            this.anchor = json.anchor || { x: 0, y: 0 };
        }
        else {
            this.model.frames = textures.map((item, index) => {
                return {
                    textureName: item.name,
                    frameName: null,
                    index
                }
            });
        }
        this.model.resources = textures;
    }


    @action
    rename(exp: { from: string, to: string }[]) {
        for (let item of exp) {
            const from = path.join(this.dirname, item.from);
            const to = path.join(this.dirname, item.to);
            fs.renameSync(from, to);
            const frames = this.model.frames.filter(frame => frame.textureName === item.from);
            frames.forEach(frame => frame.textureName = item.to);
            const texture = this.model.resources.find(r => r.name === item.from);
            texture.name = item.to
            texture.alias = parseInt(item.to).toString();
        }
        this.save();

    }
}

export const animationViewModel = new AnimationViewModel();

window['data'] = animationViewModel;
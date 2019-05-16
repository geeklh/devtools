import { Modal, notification } from 'antd';
import { shell } from 'electron';
import * as fs from 'fs-extra-promise';
import { action, computed, observable } from 'mobx';
import * as path from 'path';
import { loading } from '../../component/LoadingComponent';
import { createSpriteSheet, createSpriteSheet2 } from '../../spritesheet/MaxRect';
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
    anchor: { x: number, y: number },
    scale: number
}

type ActionConfig = {
    [index: string]: FrameConfig[]
}

type AnimationConfig = {
    actions: ActionConfig;
    resources: string[];
}

export class AnimationModel {

    @observable
    frames: AnimationFrameData[] = [];


    @observable
    resources: Texture[] = [];

    @observable
    anchor: { x: number, y: number } = { x: 200, y: 300 };

    @observable
    scale: number = 1;

    private dirname: string;

    @action
    async init(root1: string, subDir?: string) {
        if (!subDir) subDir = "";
        let resourceRootDir = path.join(root1, subDir).normalize().split('\\').join("/");
        console.log(`resourceRootDir:${resourceRootDir}`);
        if (resourceRootDir.lastIndexOf('/') != resourceRootDir.length - 1) {
            resourceRootDir = resourceRootDir + "/";
        }
        const projectRoot = appSettings.get("project.root");
        const dirname = path.join(projectRoot, resourceRootDir);
        this.dirname = dirname;
        const files = fs.readdirSync(dirname)
            .filter((item) => item.indexOf('.png') >= 0)
        const textures: Texture[] = [];
        for (let i = 0; i < files.length; i++) {
            const item = files[i];
            textures.push(await loadTexture(`http://localhost:50000${resourceRootDir}${item}`, path.join(subDir, item).split("\\").join("/")));
        }
        const configFilename = path.join(dirname, "config.json");
        if (fs.existsSync(configFilename)) {
            const text = fs.readFileSync(configFilename, 'utf-8');
            console.log(`configPath:${configFilename}`)
            const json = JSON.parse(text) as LegacyActionConfig;
            this.frames = json.textures;
            console.log(`json`);
            console.log(json);
            this.anchor = json.anchor || { x: 200, y: 300 };
            this.scale = json.scale || 1;
        }
        else {
            this.frames = textures.map((item, index) => {
                return {
                    textureName: item.name,
                    frameName: null,
                    index
                }
            });
        }
        this.resources = textures;
    }

    @action
    save() {
        const frames = this.frames;
        const resources = this.resources.map((item) => item.name);
        const anchor = this.anchor;
        const scale = this.scale;
        const json: LegacyActionConfig = { textures: frames, resources, anchor, scale };

        const text = JSON.stringify(json, null, '  ');

        fs.writeFileSync(path.join(this.dirname, "config.json"), text, "utf-8");
        notification.open({
            message: '保存成功',
            description: '保存成功',
            duration: 3
        });
    }

    @action
    rename(exp: { from: string, to: string }[]) {
        for (let item of exp) {
            const from = path.join(this.dirname, item.from);
            const to = path.join(this.dirname, item.to);
            fs.renameSync(from, to);
            const frames = this.frames.filter(frame => frame.textureName === item.from);
            frames.forEach(frame => frame.textureName = item.to);
            const texture = this.resources.find(r => r.name === item.from);
            texture.name = item.to
            texture.alias = parseInt(item.to).toString();
        }
        this.save();

    }



    @action
    exportTestFrame(): any {

        const copy = (outputDir: string) => {
            let index = 0;
            for (let texture of this.frames) {
                index++;
                const filename = `${index}.png`;
                console.log(`发布保存  this.dirname:${this.dirname}, texture.textureName:${texture.textureName}`)
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
}


export class AnimationViewModel {

    actionAnimationModel: ActionAnimationModel = new ActionAnimationModel();

    async createActionAnimation() {
        const projectRoot = appSettings.get("project.root");
        const dirname = path.join(projectRoot, this.selectedDirname);
        const files = fs.readdirSync(dirname).filter(item => {
            const subdirname = path.join(dirname, item);
            const stats = fs.statSync(subdirname);
            if (stats.isDirectory() && item != "release") {
                return true;
            }
            return false;
        });

        const x = loading();
        let i = 0;
        for (let item of files) {
            const model = new AnimationModel();
            i++;
            x.onProgress(i, files.length);
            await model.init(this.selectedDirname, item);
            this.actionAnimationModel.models.set(item, model);
        }

    }



    @observable
    model: AnimationModel = new AnimationModel();

    @observable
    currentIndex = 0;

    @observable
    selectedDirname: string;

    private dirname: string;

    private animationId = 0;



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
        if (this.selectedDirname) {
            const root = appSettings.get("project.root");
            const dirname = path.join(root, this.selectedDirname);
            shell.showItemInFolder(dirname);
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
                if (this.animationFrameCount++ % 8 == 0) {
                    console.log('下一帧')
                    this.nextFrame();
                }
                this.animationId = requestAnimationFrame(update);
            }
            this.animationId = requestAnimationFrame(update);
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
    release2() {
        const releaseDir = path.join(this.dirname, "release/");
        if (!fs.existsSync(releaseDir)) {
            fs.mkdirSync(releaseDir);
        }
        createSpriteSheet2(this.actionAnimationModel.models, this.dirname);
        notification.open({
            message: '导出成功',
            description: '导出成功',
            duration: 3
        });

    }

    @action
    release() {
        const releaseDir = path.join(this.dirname, "release/");
        if (!fs.existsSync(releaseDir)) {
            fs.mkdirSync(releaseDir);
        }

        createSpriteSheet(this.model, this.dirname);

    }

    @action
    async copyAll() {
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

            await fs.copyAsync(path.join(dir, "release"), `./releaseAll/${item}`);
            index++;
            reporter.onProgress(index, total)
        }


    }

    async init(relativeDirName: string) {
        const projectRoot = appSettings.get("project.root");
        this.dirname = path.join(projectRoot, relativeDirName);
        this.model = new AnimationModel();
        await this.model.init(relativeDirName)
    }
}

class ActionAnimationModel {

    @observable
    models = new Map<string, AnimationModel>();

    @computed
    get actionList() {
        const result = [];
        for (let item of this.models.keys()) {
            result.push(item)
        }
        return result;
    }
}


export const animationViewModel = new AnimationViewModel();

window['data'] = animationViewModel;
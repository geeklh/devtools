import { shell } from 'electron';
import * as fs from 'fs';
import { action, computed, observable } from 'mobx';
import * as path from 'path';
import { loadTexture, Texture } from "../../Utils";
import { appSettings } from '../settings/Settings';
import { Modal, notification } from 'antd';

export interface AnimationFrameData {

    index: number;

    textureName: string;

    frameName: string;

}

export class AnimationData {

    @observable
    textures: AnimationFrameData[] = [];


    @observable
    resources: Texture[] = [];

    @observable
    currentIndex = 0;
    

    private dirname: string;

    private animationId = 0;

    // 检测图片下标输出
    @computed
    get imageSrc() {
        return this.textures[this.currentIndex]
    }

    @computed
    get currentFrame() {
        return this.textures[this.currentIndex];
    }

    @computed
    get currentTexture() {
        return this.resources.find(item => item.name === this.textures[this.currentIndex].textureName)
    }

    @computed
    get originalTexture() {
        return this.resources[this.currentIndex];
    }

    @action
    removeAndUsePreviewFrame() {
        this.textures[this.currentIndex].textureName = this.textures[this.currentIndex - 1].textureName;
    }

    @action
    useFrame(frameIndex: number) {
        this.textures[this.currentIndex].textureName = this.resources[frameIndex].name;
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
        if (this.currentIndex >= this.textures.length) {
            this.currentIndex = 0;
        }
    }

    @action
    selectFrame(index: number) {
        this.currentIndex = index;
    }

    @computed
    get textureUsed() {
        const arr = [];

        for (var i = 0; i < this.textures.length; i++) {
            const current = this.textures[i];
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

    @action
    play() {
        if (this.animationId == 0) {
            const update = () => {
                this.nextFrame();
                this.animationId = requestAnimationFrame(update);
            }
            this.animationId = requestAnimationFrame(update);
        }
    }

    @action
    save() {
        const textures = this.textures;
        const resources = this.resources.map((item) => item.name);
        const frameRate = 60;
        const json = { textures, resources, frameRate };
        const text = JSON.stringify(json);
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
            for (let texture of this.textures) {
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
    }

    async init(files: string[], dirname: string) {

        this.dirname = dirname;
        await Promise.all(files.map(item => loadTexture(item))).then((textures) => {
            const configFilename = path.join(dirname, "config.json")
            if (fs.existsSync(configFilename)) {
                const text = fs.readFileSync(configFilename, 'utf-8');
                const json = JSON.parse(text);
                this.textures = json.textures;
            }
            else {
                this.textures = textures.map((item, index) => {
                    return {
                        textureName: item.name,
                        frameName: null,
                        index
                    }
                });
            }

            this.resources = textures;
        })
    }
}

export const animationData = new AnimationData();
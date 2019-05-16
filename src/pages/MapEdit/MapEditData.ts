import { notification, message, Row, Col } from 'antd';
import * as fs from 'fs';
import { action, observable, $mobx, computed } from 'mobx';
import * as path from 'path';
import { clipImageData, encodeJpg } from "../../ImageProcessor";
import { loadTexture, Texture } from "../../Utils";
import { appSettings } from "../settings/Settings";

type LegacyActionConfig = {
    boxArr: {},
    stepPoint: object,
    Row: number,
    Col: number
}


export class MapEditData {


    @observable
    currentIndex = 0;

    boxArr = [];//存储红色区域
    stepPointFillBox = [];//存储蓝色区域

    @observable
    public texture: Texture;//资源

    private dirname: string;//文件

    // 控制修改画布的出现
    @observable
    public canvas_switch = 1;
    // 画布的宽高
    @observable
    public canvas_width: number;
    @observable
    public canvas_height: number;

    // 放大和缩小倍数
    @observable
    public multiple = 1;

    @observable
    public area_switch: number;
    @observable
    public area_world = "选择渲染模式";

    private pic_row: number;
    private pic_col: number;
    // 格子数
    public gridnum_row: number;
    public gridnum_col: number;

    @observable selectedRowKeys = [];
    @observable selectedRows = [];
    @observable _key = 0;
    @observable public stepPoint: { key: number, x: number, y: number }[] = [];


    async init(value: string) {
        value = value.replace(appSettings.get("project.root"), "");
        const projectRoot = appSettings.get("project.root")
        const arr = value.split(".");
        const relativeDirName = arr[0];
        this.dirname = path.join(projectRoot, relativeDirName);
        const texture = await loadTexture("http://localhost:50000" + value, '11');
        const { width, height } = texture.rawData;
        const TILE_WIDTH = 512;
        const TILE_HEIGHT = 512;
        const row = height / TILE_WIDTH;
        const col = width / TILE_HEIGHT;
        this.pic_row = row;
        this.pic_col = col;
        console.log(row, col, "查看行列参数")
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
        this.gridnum_col = Math.floor(texture.rawData.width / 64);
        this.gridnum_row = Math.floor(texture.rawData.height / 64);
        this.texture = texture;
        const total = height * width;
        const box = 64 * 64;
        for (var k = box; k < total; k += box) {
            this.boxArr.push(total[k]);
            this.stepPointFillBox.push(total[k])
            for (var point_value in this.stepPointFillBox) {
                this.stepPointFillBox[point_value] = 0;
            }
            for (var value in this.boxArr) {
                this.boxArr[value] = 0;
            }
        }
    }


    @action
    add() {
        this.stepPointFillBox = [];
        let canvas = document.getElementById("canvas");
        let context = (canvas as any).getContext("2d");
        const inputX_value = (document.getElementById('inputX') as any).value;
        const inputY_value = (document.getElementById('inputY') as any).value;
        let defaultGridWidth = 64 * this.multiple;
        const jsonarr = {
            key: this._key,
            x: inputX_value,
            y: inputY_value
        }
        if (inputX_value != "" && inputY_value != "") {
            this._key += 1;
            this.stepPoint.push(jsonarr)
            const stepPoint_x = Math.floor(inputX_value / defaultGridWidth);
            const stepPoint_y = Math.floor(inputY_value / defaultGridWidth);
            this.stepPointFillBox[stepPoint_y * this.gridnum_col + stepPoint_x] = 1;
            this.fillArea(context, this.stepPointFillBox, 'rgba(30 , 144 , 255 , 0.5)', defaultGridWidth)
            message.success("添加成功！");
        } else {
            this._key -= 1;
            message.error("添加失败！")
        };
    }

    @action
    removeSelect = () => this.removeOption(this.selectedRowKeys);


    @action
    remove = keyArr => this.removeOption(keyArr)

    @action
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.selectedRowKeys = selectedRowKeys;
        this.selectedRows = selectedRows;
    }

    save() {
        const boxArr = this.boxArr;
        for (var i = 0; i < this.stepPoint.length; i++) {
            delete this.stepPoint[i].key
        }
        const stepPoint = this.stepPoint;
        const json: LegacyActionConfig = { boxArr: boxArr, stepPoint: stepPoint, Row: this.pic_row, Col: this.pic_col }
        if (this.texture) {
            const context = JSON.stringify(json, null, ' ');
            fs.writeFileSync(path.join(this.dirname, "config.json"), context, "utf-8");
            notification.open({
                message: '保存成功',
                description: '保存成功',
                duration: 3
            });
        }

    }

    async load() {
        let screenWidth = this.canvas_width * this.multiple;
        let screenHeight = this.canvas_height * this.multiple;
        let canvas = document.getElementById("canvas");
        let context = (canvas as any).getContext("2d");
        context.clearRect(0, 0, screenWidth, screenHeight)
        let defaultGridWidth = 64 * this.multiple;
        if (this.texture) {
            const content = JSON.parse(fs.readFileSync(path.join(this.dirname, "config.json"), 'utf-8'));
            this.stepPoint = content.stepPoint;
            this.boxArr = [];
            for (var k = 0; k < content.boxArr.length; k++) {
                this.boxArr.push(content.boxArr[k])
            }
            for (var i = 0; i < this.stepPoint.length; i++) {
                this.stepPoint[i].key = this._key;
                this._key += 1;
                const x = Math.floor(this.stepPoint[i].x / 64);
                const y = Math.floor(this.stepPoint[i].y / 64);
                this.stepPointFillBox[y * this.gridnum_col + x] = 1;
            }
            this.fillArea(context, this.boxArr, 'rgba(192, 80, 77, 0.7)', defaultGridWidth)
            this.fillArea(context, this.stepPointFillBox, 'rgba(30 , 144 , 255 , 0.5)', defaultGridWidth)
            notification.open({
                message: '提示信息',
                description: '载入成功',
                duration: 3
            });
        }
    }

    @action
    clear_all() {
        let canvas = document.getElementById("canvas");
        let context = (canvas as any).getContext("2d");
        let screenWidth = 9000 * this.multiple;
        // 清空区域规划面积
        for (var i = 0; i < this.boxArr.length; i++) {
            this.boxArr[i] = 0;
        }
        for (var k = 0; k < this.stepPointFillBox.length; k++) {
            this.stepPointFillBox[k] = 0;
        }
        this.stepPoint = [];
        context.clearRect(0, 0, screenWidth, screenWidth)
    }

    async changeSize() {
        let canvas = document.getElementById("canvas");
        let context = (canvas as any).getContext("2d");
        const zoom_value = (document.getElementById('zoomcontrol') as any).value;
        this.multiple = this.check_null(zoom_value) ? 1 : zoom_value
        let defaultGridWidth = 64 * this.multiple
        context.clearRect(0, 0, this.canvas_width, this.canvas_height)
        this.fillArea(context, this.boxArr, 'rgba(192, 80, 77, 0.7)', defaultGridWidth)
        this.fillArea(context, this.stepPointFillBox, 'rgba(30 , 144 , 255 , 0.5)', defaultGridWidth)
    }

    @action
    area_change() {
        this.area_switch = 1;
        this.area_world = "区域规划模式"
    }
    @action
    area_unchange() {
        this.area_switch = 2;
        this.area_world = "反选区域模式"
    }
    @action
    area_steptchange() {
        this.area_switch = 3;
        this.area_world = "步点设置模式"
    }
    public can_height = null;
    public can_width = null;
    @action
    canvas_control() {
        this.canvas_switch = 2;
        this.canvas_height = this.check_null(this.can_height.state.value) ? 3900 : this.can_height.state.value;
        this.canvas_width = this.check_null(this.can_width.state.value) ? 3900 : this.can_width.state.value;
    }

    async removeOption(keyArr) {
        let canvas = document.getElementById("canvas");
        let context = (canvas as any).getContext("2d");
        let defaultGridWidth = 64 * this.multiple;
        if (this.stepPoint != null) {
            if (keyArr.length > 1) {
                this.stepPoint = this.stepPoint.filter(item => this.selectedRowKeys.indexOf(item.key) === -1);
                for (var i = 0; i < this.selectedRows.length; i++) {
                    const stepPoint_x = Math.floor(this.selectedRows[i].x / defaultGridWidth);
                    const stepPoint_y = Math.floor(this.selectedRows[i].y / defaultGridWidth);
                    this.stepPointFillBox[stepPoint_y * this.gridnum_col + stepPoint_x] = 0;
                    this.cleanArea(context, this.stepPointFillBox, defaultGridWidth);
                }
                this.selectedRowKeys = [];
            } else {
                this.stepPoint = this.stepPoint.filter(item => item.key != keyArr.key);
                const stepPoint_x = Math.floor(keyArr.x / defaultGridWidth);
                const stepPoint_y = Math.floor(keyArr.y / defaultGridWidth);
                this.stepPointFillBox[stepPoint_y * this.gridnum_col + stepPoint_x] = 0;
                this.cleanArea(context, this.stepPointFillBox, defaultGridWidth);
            }
            message.success("删除成功");
        } else {
            message.error("删除失败");
        }
    }

    // 填充格子
    fillArea = (context, arr, color, defaultGridWidth) => {
        for (let row = 0; row <= this.gridnum_row; row++) {
            for (let col = 0; col <= this.gridnum_col; col++) {
                const value = arr[row * this.gridnum_row + col];
                if (value == 1) {
                    context.fillStyle = color;
                    context.fillRect(col * defaultGridWidth, row * defaultGridWidth, defaultGridWidth, defaultGridWidth)
                }
            }
        }
    }
    // 清理格子
    cleanArea = (context, arr, defaultGridWidth) => {
        for (let row = 0; row <= this.gridnum_row; row++) {
            for (let col = 0; col <= this.gridnum_col; col++) {
                const value = arr[row * this.gridnum_row + col];
                if (value == 0) {
                    context.clearRect(col * defaultGridWidth, row * defaultGridWidth, defaultGridWidth, defaultGridWidth)
                }
            }
        }
    }
    check_null = (num) => {
        if (num == null || num == '' || num == undefined || num < 0) {
            return true;
        }
    }
}

export const mapeditData = new MapEditData();

window['mapdata'] = mapeditData;

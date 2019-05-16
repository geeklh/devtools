import { autorun } from 'mobx';
import React from "react";
import { FileSystemTree } from "../../project/FileSystemTree";
import { mapeditData } from "./MapEditData";
import { observer } from 'mobx-react';
import { relative } from 'path';

@observer
export class MapEditPreview extends React.Component {

    constructor(props, state) {
        super(props, state);
    }

    private _context: CanvasRenderingContext2D;
    private _paintBox: any[];
    private _multiple: number;
    private _convas: HTMLCanvasElement;

    // 画笔
    private paintBrush(convas: HTMLCanvasElement, context: CanvasRenderingContext2D, paintBox: any[], multiple: number) {
        this._context = context;
        this._paintBox = paintBox;
        this._multiple = multiple;
        this._convas = convas
        this.removecleanListner();
        convas.addEventListener("mousedown", this.handler)
    }
    private cleanBrush(convas: HTMLCanvasElement, context: CanvasRenderingContext2D, paintBox: any[], multiple: number) {
        this._context = context;
        this._paintBox = paintBox;
        this._multiple = multiple;
        this._convas = convas
        this.removepaintListner();
        convas.addEventListener("mousedown", this.handlclean)
    }
    private paintStept(convas: HTMLCanvasElement, context: CanvasRenderingContext2D, paintBox: any[], multiple: number) {
        this._context = context;
        this._paintBox = paintBox;
        this._multiple = multiple;
        this._convas = convas
        this.removesteptListner();
        convas.addEventListener("mousedown", this.handlstept)
    }

    public removepaintListner() {
        this._convas.removeEventListener("mousedown", this.handler)
    }
    public removecleanListner() {
        this._convas.removeEventListener("mousedown", this.handlclean)
    }
    public removesteptListner() {
        this._convas.removeEventListener("mousedown", this.handlstept)
    }

    private handler = (event) => {
        var moveX = event.clientX - this._convas.getBoundingClientRect().left;
        var moveY = event.clientY - this._convas.getBoundingClientRect().top;
        this._context.moveTo(moveX, moveY);
        let defaultGridWidth = 64 * this._multiple;
        const x = Math.floor(moveX / defaultGridWidth);
        const y = Math.floor(moveY / defaultGridWidth);
        document.onmousemove = (e) => {
            var endX = e.clientX - this._convas.getBoundingClientRect().left;
            var endY = e.clientY - this._convas.getBoundingClientRect().top;
            const endGridx = Math.floor(endX / defaultGridWidth);
            const endGridy = Math.floor(endY / defaultGridWidth);
            let x1 = x, y1 = y;
            let x2 = endGridx, y2 = endGridy;
            let minX = Math.min(x1, x2);
            let maxX = Math.max(x1, x2);
            let minY = Math.min(y1, y2);
            let maxY = Math.max(y1, y2);
            console.log(x1, x2, "查看数值")
            for (let currentX = minX; currentX <= maxX; currentX++) {
                for (let currentY = minY; currentY <= maxY; currentY++) {
                    this._paintBox[currentY * mapeditData.gridnum_row + currentX] = 1
                }
            }
            this._context.clearRect(0, 0, mapeditData.canvas_width, mapeditData.canvas_height);
            mapeditData.fillArea(this._context, this._paintBox, 'rgba(192, 80, 77, 0.7)', defaultGridWidth)
            mapeditData.fillArea(this._context, mapeditData.stepPointFillBox, 'rgba(30 , 144 , 255 , 0.5)', defaultGridWidth)
        }
        this._paintBox[y * mapeditData.gridnum_row + x] = 1;
        this._context.clearRect(0, 0, mapeditData.canvas_width, mapeditData.canvas_height);
        mapeditData.fillArea(this._context, this._paintBox, 'rgba(192, 80, 77, 0.7)', defaultGridWidth)
        mapeditData.fillArea(this._context, mapeditData.stepPointFillBox, 'rgba(30 , 144 , 255 , 0.5)', defaultGridWidth)
        console.log(this._paintBox, 11)
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        }
    }
    private handlstept = (event) => {
        var moveX = event.clientX - this._convas.getBoundingClientRect().left;
        var moveY = event.clientY - this._convas.getBoundingClientRect().top;
        this._context.moveTo(moveX, moveY);
        let defaultGridWidth = 64 * this._multiple;
        const x = Math.floor(moveX / defaultGridWidth);
        const y = Math.floor(moveY / defaultGridWidth);
        // 获取每个格子的左上角的坐标
        const result_stept_x = x * 64;
        const result_stept_y = y * 64;
        const jsonarr = {
            key: mapeditData._key,
            x: result_stept_x,
            y: result_stept_y
        }
        mapeditData._key += 1;
        this._paintBox.push(jsonarr)
        mapeditData.stepPointFillBox[y * mapeditData.gridnum_row + x] = 1;
        this._context.clearRect(0, 0, mapeditData.canvas_width, mapeditData.canvas_height)
        mapeditData.fillArea(this._context, mapeditData.boxArr, 'rgba(192, 80, 77, 0.7)', defaultGridWidth)
        mapeditData.fillArea(this._context, mapeditData.stepPointFillBox, 'rgba(30 , 144 , 255 , 0.5)', defaultGridWidth)
        console.log(result_stept_x, x)
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        }
    }


    private handlclean = (event) => {
        var moveX = event.clientX - this._convas.getBoundingClientRect().left;
        var moveY = event.clientY - this._convas.getBoundingClientRect().top;
        this._context.moveTo(moveX, moveY);
        let defaultGridWidth = 64 * this._multiple;
        // 拖动清除操作
        document.onmousemove = (e) => {
            var lineX = e.clientX - this._convas.getBoundingClientRect().left;
            var lineY = e.clientY - this._convas.getBoundingClientRect().top;
            const lx = Math.floor(lineX / defaultGridWidth);
            const ly = Math.floor(lineY / defaultGridWidth);
            const result_lx = lx * defaultGridWidth;
            const result_ly = ly * defaultGridWidth;

            this._paintBox[ly * mapeditData.gridnum_row + lx] = 0;
            mapeditData.stepPointFillBox[ly * mapeditData.gridnum_row + lx] = 0;

            mapeditData.stepPoint = mapeditData.stepPoint.filter(item => (item.x != result_lx || item.y != result_ly));
            for (let row = 0; row <= mapeditData.gridnum_row; row++) {
                for (let col = 0; col <= mapeditData.gridnum_col; col++) {
                    const area_value = this._paintBox[row * mapeditData.gridnum_row + col];
                    const stept_value = mapeditData.stepPointFillBox[row * mapeditData.gridnum_row + col];
                    if (area_value === 0 && stept_value === 0) {
                        this._context.clearRect(col * defaultGridWidth, row * defaultGridWidth, defaultGridWidth, defaultGridWidth)
                    }
                }
            }
        }
        const x = Math.floor(moveX / defaultGridWidth);
        const y = Math.floor(moveY / defaultGridWidth);
        const result_x = x * 64;
        const result_y = y * 64;
        mapeditData.stepPoint = mapeditData.stepPoint.filter(item => (item.x != result_x || item.y != result_y));
        this._paintBox[y * mapeditData.gridnum_row + x] = 0;
        mapeditData.stepPointFillBox[y * mapeditData.gridnum_row + x] = 0;
        for (let row = 0; row <= mapeditData.gridnum_row; row++) {
            for (let col = 0; col <= mapeditData.gridnum_row; col++) {
                const area_value = this._paintBox[row * mapeditData.gridnum_row + col];
                const stept_value = mapeditData.stepPointFillBox[row * mapeditData.gridnum_row + col];
                if (area_value === 0 && stept_value === 0) {
                    this._context.clearRect(col * defaultGridWidth, row * defaultGridWidth, defaultGridWidth, defaultGridWidth)
                }
            }
        }
        console.log(x, defaultGridWidth, this._multiple)
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        }
    }

    // 描绘网格
    private drawGrid(color, context, stepx, stepy, multiple) {
        context.save();
        context.fillStyle = 'rgba(0,0,0,0)';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        context.lineWidth = 0.5;
        context.strokeStyle = color;
        const new_x = stepx * multiple;
        const new_y = stepy * multiple;
        for (var i = new_x; i < context.canvas.width; i += new_x) {
            context.beginPath();
            context.moveTo(i, 0);
            context.lineTo(i, context.canvas.height);
            context.closePath();
            context.stroke();
        }
        for (var j = new_y; j < context.canvas.height; j += new_y) {
            context.beginPath();
            context.moveTo(0, j);
            context.lineTo(context.canvas.width, j);
            context.closePath();
            context.stroke();
        }
        context.restore();
    }

    private scroll(obj) {
        obj.style.overflowX = "auto";
        obj.style.overflowY = "auto";
    }

    render() {
        return (
            <div id="canvasWindow" style={{ width: 800, height: 800, position: "relative" }}>
                <FileSystemTree root="三国资源整理/Z-战斗场景/B-背景图" onSelected={async (value) => {
                    mapeditData.init(value)
                }} />
                <canvas ref={(ref) => {
                    autorun(() => {
                        if (ref != null) {
                            const context = ref.getContext("2d");
                            const canwin = document.getElementById('canvasWindow')
                            if (mapeditData.texture) {
                                imageWidth = mapeditData.texture.rawData.width;
                                imageHeight = mapeditData.texture.rawData.height
                                context.drawImage(mapeditData.texture.bitmapData, 0, 0, mapeditData.texture.rawData.width * mapeditData.multiple, mapeditData.texture.rawData.height * mapeditData.multiple)
                                this.drawGrid('#ccc', context, 64, 64, mapeditData.multiple);
                                this.scroll(canwin);
                            }
                        }
                    })
                }} width={mapeditData.canvas_width * mapeditData.multiple} height={mapeditData.canvas_height * mapeditData.multiple} style={{ height: mapeditData.canvas_height * mapeditData.multiple, width: mapeditData.canvas_width * mapeditData.multiple, position: "absolute" }}>
                </canvas>
                <canvas id="canvas" ref={(ref) => {
                    autorun(() => {
                        const context = ref.getContext("2d");
                        if (mapeditData.texture) {
                            if (mapeditData.area_switch == 1) {
                                this.paintBrush(ref, context, mapeditData.boxArr, mapeditData.multiple);
                                this.removecleanListner();
                                this.removesteptListner();
                            } else if (mapeditData.area_switch == 2) {
                                this.cleanBrush(ref, context, mapeditData.boxArr, mapeditData.multiple);
                                this.removepaintListner();
                                this.removesteptListner();
                            } else if (mapeditData.area_switch == 3) {
                                this.paintStept(ref, context, mapeditData.stepPoint, mapeditData.multiple)
                                this.removecleanListner();
                                this.removepaintListner();
                            }
                        }
                    })
                }} width={mapeditData.canvas_width * mapeditData.multiple} height={mapeditData.canvas_height * mapeditData.multiple} style={{ height: mapeditData.canvas_height * mapeditData.multiple, width: mapeditData.canvas_width * mapeditData.multiple, position: "absolute" }}>
                </canvas>
            </div>
        )
    }
}


export let imageWidth;
export let imageHeight;
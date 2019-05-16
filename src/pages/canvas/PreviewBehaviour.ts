import { AnimationModel } from "../animation/AnimationViewModel";
import { CanvasBehaviourBase } from "./CanvasObject";

export class AnimationRendererBehaviour extends CanvasBehaviourBase {

    index = 0;

    offsetX: number = 0;
    offsetY: number = 0;

    ignoreAnchor: boolean = false;

    public model: AnimationModel;

    constructor() {
        super();
    }
    private count = 0

    onUpdate() {
        if (this.model.resources.length == 0) {
            return;
        }
        const texture = this.model.resources[this.index];
        const anchorX = this.ignoreAnchor ? 0 : this.model.anchor.x;
        const anchorY = this.ignoreAnchor ? 0 : this.model.anchor.y;
        const { width, height } = texture.bitmapData;
        const global_offset_x = this.offsetX - anchorX;
        const global_offset_y = this.offsetY - anchorY;
        this.context.drawImage(texture.bitmapData, global_offset_x, global_offset_y, width * this.model.scale, height * this.model.scale);

        // this.context.save();
        // this.context.lineWidth = 2;
        // this.context.strokeStyle = `red`;
        // this.context.beginPath();
        // this.context.moveTo(anchorX - 10, 0);
        // this.context.lineTo(anchorX + 20, 0);
        // this.context.moveTo(0, anchorY - 10);
        // this.context.lineTo(0, anchorY + 20);

        // this.context.moveTo(anchorX - 50, anchorY - 140);
        // this.context.lineTo(anchorX + 50, anchorY - 140);

        // this.context.closePath();
        // this.context.stroke()
        // this.context.restore();

        this.count++;
        if (this.count >= 4) {// 以60 为单位 2为30帧 1为60帧 4为15 帧
            this.count = 0;
            this.index++;
        }
        if (this.model.resources.length <= this.index) {
            this.index = 0;
        }
    }
}
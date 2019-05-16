import { autorun } from 'mobx';
import React from "react";
import { animationData } from "./AnimationData";

export class AnimationPreviewWidget extends React.Component {

    render() {
        return (<canvas id="canvas" ref={(ref) => {
            autorun(() => {
                const context = ref.getContext("2d");

                context.clearRect(0, 0, 400, 400);
                context.font = "24px 微软雅黑";
                if (animationData.currentTexture) {
                    context.fillText("调整后动画", 50, 100);
                    context.drawImage(animationData.currentTexture.bitmapData, -100, 0);
                }
                if (animationData.originalTexture) {
                    context.fillText("原始动画", 250, 100);
                    context.drawImage(animationData.originalTexture.bitmapData, 100, 0);
                }
            })

        }} width={400} height={400} style={{ width: 400, height: 400 }}></canvas>)
    }
}
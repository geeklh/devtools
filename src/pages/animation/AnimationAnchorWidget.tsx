import { Button, Dropdown, Menu } from 'antd';
import { observer } from 'mobx-react';
import React from "react";
import { CanvasBehaviourBase } from "../canvas/CanvasObject";
import { CanvasView } from "../canvas/CanvasView";
import { AnimationRendererBehaviour } from "../canvas/PreviewBehaviour";
import { animationViewModel } from "./AnimationViewModel";

@observer
export class AnimationAnchorWidget extends React.Component {

    render() {

        const model = animationViewModel.model;
        const { width, height } = model.resources[0].bitmapData;



        const menuData = [
            { x: 200, y: 300 }
        ]

        const items = menuData.map((item, index) => {
            const key = `${item.x},${item.y}`;
            return (

                <Menu.Item key={key}>
                    <a href="#">坐标点({key})</a>
                </Menu.Item>
            )
        });

        const menu = (
            <Menu onClick={(v) => {
                const arr = v.key.split(",");
                const x = parseInt(arr[0]);
                const y = parseInt(arr[1]);
                animationViewModel.model.anchor = { x, y };
                console.log(`锚点:   x:${animationViewModel.model.anchor.x}  y:${animationViewModel.model.anchor.y}`);
                console.log(v)
            }}>
                {items}
            </Menu>
        );


        const { x, y } = animationViewModel.model.anchor;

        return (
            <div>
                <Dropdown overlay={menu} placement="bottomLeft">
                    <Button>坐标点({x},{y})</Button>
                </Dropdown>
                <CanvasView width={width} height={height} onInit={(canvas) => {
                    const animationRenderer = new AnimationRendererBehaviour();
                    animationRenderer.model = model;
                    animationRenderer.ignoreAnchor = true;
                    canvas.addBehaviour(animationRenderer);
                    canvas.addBehaviour(new CoordinateBehaviour());
                }}></CanvasView>
            </div>
        )
    }
}

class CoordinateBehaviour extends CanvasBehaviourBase {

    onEnable() {

        const canvas = this.context.canvas;
        canvas.onclick = (event) => {
            const rect = canvas.getBoundingClientRect()
            const x = Math.floor(event.clientX - rect.left);
            const y = Math.floor(event.clientY - rect.top);
            animationViewModel.model.anchor = { x, y };
        }

    }

    onUpdate() {
        const anchor = animationViewModel.model.anchor;
        const context = this.context;
        context.save();
        context.lineWidth = 2;
        context.strokeStyle = 'red';
        context.beginPath();
        context.moveTo(anchor.x, 0);
        context.lineTo(anchor.x, context.canvas.height);
        context.moveTo(0, anchor.y);
        context.lineTo(context.canvas.width, anchor.y);

        context.moveTo(anchor.x - 50, anchor.y - 140);
        context.lineTo(anchor.x + 50, anchor.y - 140);


        context.closePath();
        context.stroke();
        context.restore();
    }
}
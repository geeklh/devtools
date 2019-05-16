import React from "react";
import { CanvasObject } from "../canvas/CanvasObject";


type CanvasViewProps = {
    width: number,
    height: number,
    onInit: (canvas: CanvasObject) => void;
}

export class CanvasView extends React.Component<CanvasViewProps> {

    private canvasObject: CanvasObject;

    private initCanvas(canvas: HTMLCanvasElement) {
        if (!canvas) {
            return;
        }

        this.canvasObject = new CanvasObject(canvas);
        this.props.onInit(this.canvasObject);
    }

    componentWillUnmount() {
        this.canvasObject.dispose();
    }

    render() {

        return (
            <canvas style={{ backgroundColor: "0x11111133" }} width={this.props.width} height={this.props.height} ref={(ref) => {
                this.initCanvas(ref);
            }}></canvas>
        )
    }
}
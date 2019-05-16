import { createImage, encodePng } from "../../ImageProcessor";

export class PngGeneratorStore {

    public name: string = "wangze"
}


export function printImage(data: PngData) {
    const imageData = createImage(data.width, data.height, (context) => {

        context.fillStyle = '#FF0000';
        context.globalAlpha = .3;
        context.lineWidth = 4;
        context.setLineDash([15, 5]);
        context.rect(2, 2, data.width - 4, data.height - 4);
        context.fill();
        context.stroke();
        context.globalAlpha = 1;
        context.font = "30px Arial";
        context.translate(data.width / 2, data.height / 2);
        context.textAlign = "center";
        context.fillText(data.label, 0, 0, data.width);
    })
    encodePng(imageData, "a.png")
}

export class PngData {
    width = 100;
    height = 100;
    label = "helloworld";
}
import { observer } from 'mobx-react';
import * as React from 'react';
import { animationViewModel, AnimationFrameData } from './AnimationViewModel';
@observer
export class AnimationFrameWidget extends React.Component {

    render() {

        const texture = animationViewModel.model.frames;
        const rects = texture.map((item) => {
            return <RectShape
                frameData={item}
                key={item.index}
            />
        })
        return <div >{rects}</div>
    }
}
@observer
class RectShape extends React.Component<{ frameData: AnimationFrameData }> {

    render() {
        const frameData = this.props.frameData;
        const texture = animationViewModel.getTextureByName(frameData.textureName);
        const selected = frameData.index === animationViewModel.currentIndex;
        const backgroundColor = selected ? "red" : "gray";
        const rectStyle: React.CSSProperties = { float: "left", color: "white", width: 20, height: 60, backgroundColor, borderColor: "black", borderStyle: "solid", margin: 1 };
        const keyframe = frameData.frameName ?
            <div style={{ height: 20, margin: 4, backgroundColor: "blue", textAlign: 'center' }}>{this.props.frameData.index}</div> :
            <div style={{ height: 20, margin: 4, textAlign: 'center' }}>{frameData.index}</div>

        const d2 = <div style={{ width: 20, height: 20, marginLeft: 4, marginRight: 4, color: "black" }}>{texture ? texture.alias : 0}</div>
        return (
            <div
                onClick={
                    () => animationViewModel.selectFrame(frameData.index)
                }
                style={rectStyle}>
                {keyframe}
                {d2}
            </div>
        )
    }
}
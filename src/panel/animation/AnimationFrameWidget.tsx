import { observer } from 'mobx-react';
import * as React from 'react';
import { animationData, AnimationFrameData } from './AnimationData';
@observer
export class AnimationFrameWidget extends React.Component {

    render() {

        const texture = animationData.textures;
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
        const selected = this.props.frameData.index === animationData.currentIndex;
        const backgroundColor = selected ? "red" : "gray";
        const rectStyle: React.CSSProperties = { float: "left", color: "white", width: 20, height: 60, backgroundColor, borderColor: "black", borderStyle: "solid", margin: 2 };
        const keyframe = this.props.frameData.frameName ?
            <div style={{ height: 20, margin: 4, backgroundColor: "blue", textAlign: 'center' }}>{this.props.frameData.index}</div> :
            <div style={{ height: 20, margin: 4, textAlign: 'center' }}>{this.props.frameData.index}</div>

        const d2 = <div style={{ width: 20, height: 20, backgroundColor: "white" }}></div>
        return (
            <div
                onClick={
                    () => animationData.selectFrame(this.props.frameData.index)
                }
                style={rectStyle}>
                {keyframe}
                {d2}
            </div>
        )
    }
}
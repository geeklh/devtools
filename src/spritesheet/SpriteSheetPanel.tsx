import React from "react";
import { animationViewModel } from "../pages/animation/AnimationViewModel";

export class SpriteSheetPanel extends React.Component {

    componentDidMount() {
        animationViewModel.release();
    }


    render() {
        return <div>测试</div>
    }
}
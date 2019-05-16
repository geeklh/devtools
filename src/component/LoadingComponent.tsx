import { Modal, Progress } from 'antd';
import React from 'react';

export function loading() {

    const reporter = {
        onProgress: (current, total) => {
            const percent = Math.floor(current * 100 / total);
            modal.update({
                title: '修改的标题',
                content: <Loading percent={percent} />,
            });
            if (current >= total) {
                modal.destroy();
            }
        }
    };

    let percent = 0;

    const modal = Modal.info({
        title: "loading", content: <Loading percent={percent} />,
        okButtonProps: { disabled: true }
    })

    return reporter;
}

class Loading extends React.Component<{ percent: number }> {




    render() {
        return (
            <Progress type="dashboard" percent={this.props.percent} />
        )
    }
}
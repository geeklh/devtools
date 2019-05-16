import { Breadcrumb } from 'antd';
import * as React from 'react';
import { store } from '../Store';
import { DaojuCard } from './DaojuCard';
import { JiNengCard } from './JiNengCard';
import { ZhuangBeiConfig } from '../../../../sanguo/src/config/item/ZhuangBeiConfig';
import { ZhuangBeiCard } from './ZhuangBeiCard';



export default class ConfigPage extends React.Component<{ router: string }> {

    componentDidMount() {
        store.load();
    }


    render() {
        const config = {
            daoju: { title: "道具配置", content: <DaojuCard /> },
            jineng: { title: "技能配置", content: <JiNengCard /> },
            zhuangbei: { title: "装备配置", content: <ZhuangBeiCard /> }
        }
        return (
            <div>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>配置</Breadcrumb.Item>
                    <Breadcrumb.Item>{config[this.props.router].title}</Breadcrumb.Item>
                </Breadcrumb>
                <div style={{ padding: 6, background: '#fff', minHeight: 360 }}>
                    {config[this.props.router].content}
                </div>
            </div>
        )
    }
}

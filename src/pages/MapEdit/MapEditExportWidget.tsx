import React from "react";
import { Button, Card } from 'antd';
import { mapeditData } from "./MapEditData";
export class MapEditExportWidget extends React.Component {
    render() {
        return (
            <Card title="配置管理">
                <Button onClick={() => { 
                    mapeditData.save() 
                    }}>
                    保存
                </Button>
                <Button onClick={() => {
                    mapeditData.load();
                }}>
                    载入
                </Button>
                <Button onClick={() => {
                    mapeditData.clear_all();
                }}>
                    清除痕迹
                </Button>
            </Card>
        )
    }
}

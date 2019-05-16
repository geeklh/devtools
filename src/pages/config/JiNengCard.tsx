import { Button, Icon, Input, Modal, Table } from 'antd';
import { shell } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import * as React from 'react';
import Highlighter from 'react-highlight-words';
import { JiNengConfig } from '../../../../sanguo/src/config/item/JiNengConfig';
import { TEXTCOLOR } from '../../../../sanguo/src/view/common/TextColor';
import { Texture } from '../../Utils';
import { animationViewModel } from '../animation/AnimationViewModel';
import { CanvasBehaviourBase } from '../canvas/CanvasObject';
import { CanvasView } from '../canvas/CanvasView';
import { appSettings } from '../settings/Settings';
import { store } from '../Store';

type TableColumnProps<T> = Table<T>['columns'];

const jinengColumn: TableColumnProps<JiNengConfig> = [{
    title: "ID",
    dataIndex: 'id' as 'id',
    width: 100,
}, {
    title: '名称',
    dataIndex: 'name' as 'name',
    width: 150,
}, {
    title: '品质',
    dataIndex: 'quality' as 'quality',
    render(text) {
        const color = "#" + TEXTCOLOR[text].toString(16)
        // const
        return (<div style={{ backgroundColor: color, width: 30, height: 30 }}>
            {/* <span style={{ color: "white" }}>{text}</span> */}
        </div >)
    }
},
{
    title: "图标",
    dataIndex: 'icon' as 'icon',
    key: "icon2",
    render(text) {
        const url = `http://localhost:50000/最终美术素材/图标/技能ID/${text}.png`
        return <img src={url}></img>
    }
}, {
    title: "动画",
    dataIndex: "icon" as 'icon',
    render(text) {

        const root = appSettings.get("project.root");
        const dirname = path.join(root, `三国资源整理/Z-战斗场景/技能特效2/${text}/release`)
        if (!fs.existsSync(dirname)) {
            return <div>未找到{text}文件夹<Button onClick={() => {
                shell.showItemInFolder(path.join(root, `三国资源整理/Z-战斗场景/技能特效2/`));
            }}>打开文件夹</Button></div>
        }
        else {
            return (
                <div><Button onClick={async () => {
                    await animationViewModel.init(`/三国资源整理/Z-战斗场景/技能特效2/${text}`)
                    Modal.info({ title: "预览", content: <CanvasPreview />, width: 500 })
                }}>预览</Button>
                    <p>{text}</p>
                </div>
            )
        }


    }
}
];


export class JiNengCard extends React.Component {

    state = {
        searchText: ''
    };

    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    }

    handleReset = (clearFilters) => {
        clearFilters();
        this.setState({ searchText: '' });
    }

    searchInput: any;

    getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys, selectedKeys, confirm, clearFilters,
        }) => (
                <div className="custom-filter-dropdown">
                    <Input
                        ref={node => { this.searchInput = node; }}
                        placeholder={`Search ${dataIndex}`}
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm)}
                        icon="search"
                        size="small"
                        style={{ width: 90, marginRight: 8 }}
                    >
                        Search
        </Button>
                    <Button
                        onClick={() => this.handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
        </Button>
                </div>
            ),
        filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: (text) => (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[this.state.searchText]}
                autoEscape
                textToHighlight={text.toString()}
            />
        ),
    })


    render() {

        const columns = jinengColumn.map(item => {
            if (item.dataIndex === 'id') {
                return Object.assign({}, item, this.getColumnSearchProps("id"))
            }
            else if (item.dataIndex === 'name') {
                return Object.assign({}, item, this.getColumnSearchProps("name"))
            }
            else {
                return item;
            }
        });


        return <Table columns={columns} dataSource={store.jineng.map(data => {
            data['key'] = data.id;
            return data;
        })} />
    }
}

class CanvasPreview extends React.Component {

    render() {
        return <CanvasView width={400} height={400} onInit={(canvas) => {
            canvas.addBehaviour(new FrameAnimationBehaviour(animationViewModel.model.resources));
        }} />
    }
}


class FrameAnimationBehaviour extends CanvasBehaviourBase {


    constructor(private textures: Texture[]) {
        super();
    }

    private _index = 0;

    onUpdate() {
        const context = this.context;
        context.clearRect(0, 0, 400, 400);
        context.save();
        const texture = this.textures[this._index];
        const { x, y, width, height } = texture.rawData;
        const global_offset_x = x - animationViewModel.model.anchor.x + 200;
        const global_offset_y = x - animationViewModel.model.anchor.y + 200;
        context.drawImage(texture.bitmapData, x, y, width, height, global_offset_x, global_offset_y, width, height);
        context.restore();
        this._index++;
        if (this._index >= animationViewModel.model.frames.length) {
            this._index = 0;
        }
    }

}

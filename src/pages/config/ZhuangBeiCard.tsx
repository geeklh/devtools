import { Button, Icon, Input, Table } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import Highlighter from 'react-highlight-words';
import { DaojuConfig } from '../../../../sanguo/src/config/item/DaojuConfig';
import { TEXTCOLOR } from '../../../../sanguo/src/view/common/TextColor';
import { store } from '../Store';
import { ZhuangBeiConfig } from '../../../../sanguo/src/config/item/ZhuangBeiConfig';




@observer
export class ZhuangBeiCard extends React.Component {

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

        const columns = daojuColumn.map(item => {
            if (item.dataIndex === 'id' && item.title === 'ID') {
                return Object.assign({}, item, this.getColumnSearchProps("id"))
            }
            else if (item.dataIndex === 'name') {
                return Object.assign({}, item, this.getColumnSearchProps("name"))
            }
            else {
                return item;
            }
        });



        return (
            <Table columns={columns} dataSource={store.zhuangbei.map(data => {
                data['key'] = data.id;
                return data;
            })} />
        )
    }
}




type TableColumnProps<T> = Table<T>['columns'];

const daojuColumn: TableColumnProps<ZhuangBeiConfig> = [
    {
        title: "ID",
        dataIndex: 'id' as 'id',
        width: 100,
        render(id) {
            return id
        }
    },
    {
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
        title: "图标1",
        key: "zhuangbei-icon",
        dataIndex: 'id' as 'id',
        render(id) {
            let text = '';
            if (id < 114021) {
                const s = id % 1000;
                text = s + ".png";
            } else {
                const s = id % 10;
                text = s + ".png";
            }
            const url = `http://localhost:50000/最终美术素材/图标/装备icon/普通装备/${text}`
            return (
                <div>
                    <img src={url}></img>
                    <p>{text}</p>
                </div>
            )
        }
    }

];


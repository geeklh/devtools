import { Icon, Layout, Menu } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { appViewModel } from './AppViewModel';
import * as SettingPanel from './pages/settings/SettingPanel';
import * as TempPage from './pages/temp/TempPage';

const {
    Header, Content, Footer, Sider,
} = Layout;
const SubMenu = Menu.SubMenu;


class Loading extends React.Component {
    render() {
        return (<div>loading...</div>)
    }
}

type RouterConfig = { key: string, label: string, children?: { key: string, label: string }[] }

class Router {

    @observable
    router: { key: string, label: string, content: typeof React.Component, children?: { key: string, label: string }[] }[] = [];

    init() {
        const routerConfig: (RouterConfig & { content: Promise<{ default: any }> })[] = [
            {
                key: "ConfigPage",
                label: "配置文件编辑",
                content: import(/* webpackChunkName: "ConfigPage" */ './pages/config/ConfigPage'),
                children: [
                    { key: 'ConfigPage.daoju', label: "道具配置" },
                    { key: "ConfigPage.jineng", label: "技能配置" },
                    { key: "ConfigPage.zhuangbei", label: "装备配置" }
                ]
            },
            {
                key: "AnimationPage",
                label: "动画面板",
                content: import(/* webpackChunkName: "AnimationPage" */ './pages/animation/AnimationPage')
            },
            {
                key: "PngGeneratorPage",
                label: "图片生成工具",
                content: import(/* webpackChunkName: "PngGeneratorPage" */ './pages/png-generator/PngGeneratorPage')
            },
            {
                key: "MapEditPage",
                label: "地图编辑器",
                content: import(/* webpackChunkName: "MapEditPage" */ './pages/MapEdit/MapEditPage')
            },
            {
                key: "SettingPage",
                label: "系统设置",
                content: new Promise((resolve, reject) => {
                    resolve(SettingPanel)
                })
            }
        ];


        this.router = routerConfig.map((item, index) => {
            const result = { key: item.key, label: item.label, content: Loading, children: item.children };
            item.content.then((m) => {
                this.router[index].content = m.default;
            });
            return result;
        });
    }
}

const router = new Router();
router.init();

@observer
export class App extends React.Component {


    constructor(props, state) {
        super(props, state);
    }

    componentDidMount() {



    }

    render() {

        const MenuItemRenderer = (item: RouterConfig) => {
            if (item.children) {
                return (
                    <SubMenu
                        key={item.key}
                        title={<span><Icon type="user" /><span>{item.label}</span></span>}
                    >
                        {item.children.map(MenuItemRenderer)}
                    </SubMenu>
                )
            }
            return (
                <Menu.Item key={item.key}>
                    <Icon type="pie-chart" />
                    <span>{item.label}</span>
                </Menu.Item>
            )
        }

        const menuItems = router.router.map(MenuItemRenderer);
        let contentsClz = router.router.find(item => item.key === appViewModel.key).content;
        if (!contentsClz) {
            contentsClz = Loading;
        }

        const contents = React.createElement(contentsClz, { router: appViewModel.subkey } as any);

        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    collapsible
                    collapsed={appViewModel.menuCollapsed}
                    onCollapse={(value) => {
                        appViewModel.menuCollapsed = value;
                    }}
                >
                    <div className="logo" />
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onSelect={(e) => {
                        appViewModel.currentMenu = e.key;
                    }}>
                        {menuItems}
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 }} />
                    <Content style={{ margin: '0 16px' }}>
                        {contents}
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Ant Design ©2018 Created by Ant UED
            </Footer>
                </Layout>
            </Layout>
        );
    }
}



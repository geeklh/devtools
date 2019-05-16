import axios from 'axios';
import { observable } from 'mobx';
import { gameConfig } from '../../../sanguo/src/config/GameConfig';
import { DaojuConfig } from "../../../sanguo/src/config/item/DaojuConfig";
import { JiNengConfig } from "../../../sanguo/src/config/item/JiNengConfig";
import { ZhuangBeiConfig } from "../../../sanguo/src/config/item/ZhuangBeiConfig";

var RES = {
    getRes: () => {
        return RES.cache;
    },
    cache: null
}
// window["RES"] = RES;
global["RES"] = RES;


class Store {

    urlRoot = "http://192.168.2.33:9001/resource";

    @observable
    daoju: DaojuConfig[] = [];

    @observable
    jineng: JiNengConfig[] = [];

    @observable
    zhuangbei: ZhuangBeiConfig[] = [];


    async load() {
        const response = await axios.get(this.urlRoot + "/2d/BinaryConfig.bin", { responseType: "arraybuffer" })
        RES.cache = response.data;
        this.daoju = gameConfig.getAllConfig(DaojuConfig);
        this.jineng = gameConfig.getAllConfig(JiNengConfig);
        this.zhuangbei = gameConfig.getAllConfig(ZhuangBeiConfig);
    }
}


export const store = new Store();
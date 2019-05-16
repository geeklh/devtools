import { observable } from 'mobx';
import { DaojuConfig } from "../../sanguo/src/config/item/DaojuConfig";
import { gameConfig } from '../../sanguo/src/config/GameConfig';
import axios from 'axios';

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


    async load() {
        const response = await axios.get(this.urlRoot + "/2d/BinaryConfig.bin", { responseType: "arraybuffer" })
        RES.cache = response.data;
        this.daoju = gameConfig.getAllConfig(DaojuConfig)
    }
}


export const store = new Store();
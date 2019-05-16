import { observable, computed } from 'mobx';

class AppViewModel {

    @observable
    menuCollapsed = false;

    @observable
    currentMenu: string = "ConfigPage.daoju"

    @computed
    get key() {
        return this.currentMenu.split(".")[0];
    }

    @computed
    get subkey() {
        return this.currentMenu.split(".")[1];
    }
}

export const appViewModel = new AppViewModel();
import { action, makeObservable, observable } from "mobx";

export class TileModel {
    flag: boolean = false;
    mine: boolean = false;
    nearbyMines: number = 0;
    revealed: boolean = false;

    constructor() {

        makeObservable(this, {
            flag: observable,
            mine: observable,
            nearbyMines: observable,
            revealed: observable,
        });
    }

}
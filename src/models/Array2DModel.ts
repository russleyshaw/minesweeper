import { action, makeObservable, observable } from "mobx";
import { ADJACENT_OFFSETS } from "../constants";

export class Array2DModel<T> {
    width: number = 0;
    height: number = 0;
    
    data: T[] = [];

    constructor() {
        makeObservable(this, {
            width: observable,
            height: observable,
            data: observable,

            set: action,
            reset: action,
        });
    }

    get(x: number, y: number): T {
        return this.data[this.width * y + x];
    }

    set(x: number, y: number, data: T) {
        this.data[this.width * y + x] = data;
    }

    reset(width: number, height: number, makeData: (x: number, y: number) => T) {
        this.width = width;
        this.height = height;
        this.data = new Array(this.width * this.height)

        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                this.data[this.width * y + x] = makeData(x, y);
            }
        }
    }

    forEach(f: (x: number, y: number, data: T) => void) {
        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                f(x, y, this.data[this.width * y + x]);
            }
        }
    }

    map<U>(f: (x: number, y: number, data: T) => U): U[] {
        const results: U[] = [];
        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                results.push(f(x, y, this.data[this.width * y + x]));
            }
        }
        return results;
    }

    getAdjacent(x: number, y: number): Array<{x: number, y: number, data: T}> {
        const results: Array<{x: number, y: number, data: T}> = [];
        for(const offset of ADJACENT_OFFSETS) {
            let offX = x + offset[0];
            let offY = y + offset[1];
            if(offX < 0 || offX >= this.width) continue;
            if(offY < 0 || offY >= this.height) continue;

            const offData = this.get(offX, offY);
            results.push({x: offX, y: offY, data: offData});
        }

        return results;
    }

}
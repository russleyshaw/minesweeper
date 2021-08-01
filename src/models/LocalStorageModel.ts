import { autorun, computed, makeObservable, observable } from "mobx";

export interface LocalStorageModelArgs<T> {
    getInitialValue: () => T;
    encode(value: T): string;
    decode(value: string): T;
    key: string;
}

export class LocalStorageModel<T> {
    args: LocalStorageModelArgs<T>;

    _data: T;

    constructor(args: LocalStorageModelArgs<T>) {
        this.args = args;

        const raw = localStorage.getItem(this.args.key);

        if (raw == null) {
            this._data = this.args.getInitialValue();
        } else {
            try {
                const decoded = this.args.decode(raw);
                this._data = decoded;
            } catch (e) {
                this._data = this.args.getInitialValue();
            }
        }

        makeObservable(this, {
            _data: observable,
        });
    }

    get(): T {
        return this._data;
    }

    set(value: T) {
        this._data = value;
        localStorage.setItem(this.args.key, this.args.encode(this._data));
    }
}

import { action, makeObservable, observable } from "mobx";
import { Array2DModel } from "./Array2DModel";
import _, { initial } from "lodash";
import { TileModel } from "./TileModel";
import { ADJACENT_OFFSETS } from "../constants";
import { LocalStorageModel } from "./LocalStorageModel";

export interface LeaderboardEntry {
    name: string;
    elapsed: number;
}

export interface Leaderboards {
    beginner: Array<LeaderboardEntry>;
    intermediate: Array<LeaderboardEntry>;
    expert: Array<LeaderboardEntry>;
}

export class AppModel {
    newGameWidth: number = 30;
    newGameHeight: number = 16;
    newGameMines: number = 99;

    minesTotal: number = 99;
    flagsRemaining: number = 99;
    secondsElapsed: number = 0;

    tiles: Array2DModel<TileModel> = new Array2DModel();
    isInitialReveal: boolean = false;
    isGameOver: boolean = false;

    leaderboards: LocalStorageModel<Leaderboards>;

    secondsTickInterval?: number;

    constructor() {
        this.leaderboards = new LocalStorageModel({
            key: "minesweeper_leaderboards",
            encode(v) {
                return JSON.stringify(v);
            },
            decode(v) {
                return JSON.parse(v);
            },
            getInitialValue() {
                return {
                    beginner: _.times(20, n => ({
                        name: `Beginner ${n}`,
                        elapsed: _.random(100, 200),
                    })),
                    expert: _.times(20, n => ({
                        name: `Expert ${n}`,
                        elapsed: _.random(100, 200),
                    })),
                    intermediate: _.times(20, n => ({
                        name: `Intermediate ${n}`,
                        elapsed: _.random(100, 200),
                    })),
                };
            },
        });

        makeObservable(this, {
            leaderboards: observable,
            newGameWidth: observable,
            newGameHeight: observable,
            newGameMines: observable,
            tiles: observable,
            flagsRemaining: observable,
            secondsElapsed: observable,

            newGame: action,
            tickSecond: action,
            populateMines: action,
            populateProximity: action,
            revealTile: action,
            toggleFlagTile: action,
            setNewGameOptions: action,
        });

        this.newGame();
    }

    tickSecond() {
        this.secondsElapsed += 1;
    }

    setNewGameOptions(width: number, height: number, mines: number) {
        this.newGameWidth = width;
        this.newGameHeight = height;
        this.newGameMines = mines;
    }

    isNewGameOptionsMatched(width: number, height: number, mines: number) {
        return (
            this.newGameWidth === width &&
            this.newGameHeight === height &&
            this.newGameMines === mines
        );
    }

    newGame() {
        console.log(
            `New Game W:${this.newGameWidth}, H:${this.newGameHeight}, M:${this.newGameMines}`
        );
        this.tiles.reset(this.newGameWidth, this.newGameHeight, (x, y) => new TileModel());
        this.minesTotal = this.newGameMines;
        this.flagsRemaining = this.newGameMines;
        this.secondsElapsed = 0;
        this.isInitialReveal = true;
        this.isGameOver = false;
        window.clearInterval(this.secondsTickInterval);
    }

    populateMines(initialX: number, initialY: number) {
        console.log(`Populating mines based on initial (${initialX}, ${initialY})`);

        const initialTile = this.tiles.get(initialX, initialY);
        const adjacentTiles = this.tiles.getAdjacent(initialX, initialY);

        // Reserve inital and adjacent tiles to give some breathing room
        const reservedTiles = new Set([initialTile, ...adjacentTiles.map(t => t.data)]);
        const availableTiles = this.tiles.data.filter(t => !reservedTiles.has(t));

        // Can only as many mines as available tiles
        const minesNeeded = Math.min(this.minesTotal, availableTiles.length);
        this.minesTotal = minesNeeded;
        this.flagsRemaining = minesNeeded;
        const newMines = _.sampleSize(availableTiles, minesNeeded);
        for (const t of newMines) {
            console.log(`Setting mine.`);
            t.mine = true;
        }

        // Start timer
        window.clearInterval(this.secondsTickInterval);
        this.secondsTickInterval = window.setInterval(() => this.tickSecond(), 1000) as number;
    }

    populateProximity() {
        this.tiles.forEach((x, y, tile) => {
            let nearbyMines = 0;

            const adjacentTiles = this.tiles.getAdjacent(x, y);
            for (const adjTile of adjacentTiles) {
                if (adjTile.data.mine) {
                    nearbyMines++;
                }
            }

            tile.nearbyMines = nearbyMines;
        });
    }

    toggleFlagTile(tile: TileModel) {
        tile.flag = !tile.flag;

        if (tile.flag) this.flagsRemaining--;
        else this.flagsRemaining++;
    }

    flagAllMines() {
        this.tiles.forEach((x, y, t) => {
            t.flag = t.mine;
        });
        this.flagsRemaining = 0;
    }

    isGameWin() {
        // Every non-mine should be revealed
        for (const tile of this.tiles.data) {
            if (!tile.mine && !tile.revealed) {
                return false;
            }
        }

        return true;
    }

    revealTile(x: number, y: number) {
        // Delaying populating of grid allows us to ensure the initially clicked tile isn't a mine.
        if (this.isInitialReveal) {
            this.populateMines(x, y);
            this.populateProximity();
        }
        this.isInitialReveal = false;

        const tile = this.tiles.get(x, y);
        tile.revealed = true;

        if (tile.mine) {
            // Gameover
            this.isGameOver = true;
            console.log("GAME OVER!");
            window.setTimeout(() => window.alert("Game Over!"), 0);
            window.clearInterval(this.secondsTickInterval);
        }

        const open: Array<[number, number, TileModel]> = [[x, y, tile]];
        const closed = new Set<TileModel>();

        while (open.length > 0) {
            const [curX, curY, curTile] = open.shift()!;
            curTile.revealed = true;

            // Clear any flags on any revealed tiles.
            if (curTile.flag) {
                this.toggleFlagTile(curTile);
            }

            closed.add(curTile);

            // We shouldn't be accidentally adding mines because a mine will always be surrounded by a nearbyMines > 0
            if (curTile.nearbyMines > 0) {
                continue;
            }

            // Add any adjacent tiles we haven't checked to our checklist.
            for (const offset of ADJACENT_OFFSETS) {
                let offX = curX + offset[0];
                let offY = curY + offset[1];
                if (offX < 0 || offX >= this.tiles.width) continue;
                if (offY < 0 || offY >= this.tiles.height) continue;

                const offTile = this.tiles.get(offX, offY);
                if (closed.has(offTile)) continue;
                open.push([offX, offY, offTile]);
            }
        }

        if (this.isGameWin()) {
            // Game WIN
            console.log("GAME WIN!");
            window.setTimeout(() => window.alert("Game Win!"), 0);
            window.clearInterval(this.secondsTickInterval);
        }
    }
}

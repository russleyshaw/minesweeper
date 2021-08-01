export const LOCAL_STORAGE_SCOPE = "russley_minesweeper";

// prettier-ignore
export const ADJACENT_OFFSETS = [
    [-1, -1], [0, -1], [1, -1],
    [-1,  0],          [1,  0],
    [-1,  1], [0,  1], [1,  1],
];

export const COLORS = {
    black: "#2C2E43",
    darkGrey: "#595260",
    lightGrey: "#B2B1B9",
    accent: "#FFD523",
    danger: "#FF2323",
};

export interface Difficulty {
    name: string;
    width: number;
    height: number;
    mines: number;
}

export const BEGINNER_DIFFICULTY: Difficulty = { name: "Beginner", width: 9, height: 9, mines: 10 };
export const INTERMEDIATE_DIFFICULTY: Difficulty = {
    name: "Intermediate",
    width: 16,
    height: 16,
    mines: 40,
};
export const EXPERT_DIFFICULTY: Difficulty = { name: "Expert", width: 30, height: 16, mines: 99 };

export const DIFFICULTIES: Difficulty[] = [
    BEGINNER_DIFFICULTY,
    INTERMEDIATE_DIFFICULTY,
    EXPERT_DIFFICULTY,
];

export function isEquivalentDifficulty(
    width: number,
    height: number,
    mines: number,
    diff: Difficulty
): boolean {
    return width === diff.width && height === diff.height && mines === diff.mines;
}

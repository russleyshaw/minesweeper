export function safeParseInt(value: string): number | undefined {
    const num = parseInt(value, 10);
    if(Number.isSafeInteger(num)) {
        return num;
    }

    return undefined;
}
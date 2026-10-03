export class Str {

    static snippet(str: string, max_len: number): string {
        if (str.length <= max_len) {
            return str;
        }
        return str.slice(0, 47) + `...`;
    }

    static toUnixLineEndings(str: string) {
        if (str.includes(`\n`)) {
            return str.replace(/\r/g, ``);
        } else {
            return str.replace(/\r/g, `\n`);
        }
    }

    static trimAndJoin(char: string, arr: (string | undefined | null)[]) {
        return arr
            .filter(Boolean)
            .map((c) => c?.trim())
            .join(char);
    }
}

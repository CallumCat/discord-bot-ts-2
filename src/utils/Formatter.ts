export class Formatter {
    static formatBytes(bytes: number): string {
        const units = ['B', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
        let l = 0, n = bytes || 0;
        while (n >= 1024 && ++l) {
            n = n / 1024;
        }
        return (n.toFixed(n >= 10 || l < 1 ? 0 : 1) + units[l]);
    }
}
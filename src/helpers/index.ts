export * from "./utils";
export * from "./firebase";
export * from "./socket";
export * from "./times";

String.prototype.toCapitalCase = function (options): string {
    if (options?.firstLetterOnly) {
        return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
    }
    const splitBy = options?.splitBy || " ";
    const words = this.split(splitBy);
    return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
};

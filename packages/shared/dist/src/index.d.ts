export * from "./types";
export * from "./utils";
export * from "./constants";
export * from "./api";
export * from "./stores";
export declare const SHARED_ASSETS: {
    readonly icons: {
        readonly bellConcierge: "./assets/icons/bell-concierge-solid-full.svg";
        readonly calendar: "./assets/icons/calendar-regular-full.svg";
        readonly check: "./assets/icons/check-solid-full.svg";
        readonly circleCheck: "./assets/icons/circle-check-regular-full.svg";
        readonly dollarSign: "./assets/icons/dollar-sign-solid-full.svg";
        readonly hourglassHalf: "./assets/icons/hourglass-half-regular-full.svg";
        readonly minus: "./assets/icons/minus-solid-full.svg";
        readonly plus: "./assets/icons/plus-solid-full.svg";
        readonly trashCan: "./assets/icons/trash-can-regular-full.svg";
    };
};
export declare const SharedUtils: {
    /**
     * Get the full path to an asset
     */
    readonly getAssetPath: (relativePath: string) => string;
    /**
     * Get icon path by name
     */
    readonly getIconPath: (iconName: keyof typeof SHARED_ASSETS.icons) => "./assets/icons/bell-concierge-solid-full.svg" | "./assets/icons/calendar-regular-full.svg" | "./assets/icons/check-solid-full.svg" | "./assets/icons/circle-check-regular-full.svg" | "./assets/icons/dollar-sign-solid-full.svg" | "./assets/icons/hourglass-half-regular-full.svg" | "./assets/icons/minus-solid-full.svg" | "./assets/icons/plus-solid-full.svg" | "./assets/icons/trash-can-regular-full.svg";
};
//# sourceMappingURL=index.d.ts.map
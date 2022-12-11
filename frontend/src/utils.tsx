export const hms = (d: number) => {
    // Display as HH:MM:SS
    d = Number(d);

    // Hours, minutes and seconds
    const h = Math.floor(d / 3600);
    const m = Math.floor((d % 3600) / 60);
    const s = Math.floor((d % 3600) % 60);

    // Convert to string and pad with zeros
    const hDisplay = h < 10 ? "0" + h + ":" : h + ":";
    const mDisplay = m < 10 ? "0" + m + ":" : m + ":";
    const sDisplay = s < 10 ? "0" + s : s;

    return hDisplay + mDisplay + sDisplay;
};

export const hmsToSeconds = (hms: string) => {
    const a = hms.split(":"); // split it at the colons

    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    const seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];

    return seconds;
};

export const statusToColor = (status: string) => {
    switch (status) {
        case "SUCCESS":
            return "green";
        case "PROGRESS":
            return "orange";
        case "FAILURE":
            return "red";
        default:
            return "gray";
    }
};

export const numToPct = (num: number) => {
    num = Math.round(num * 100);
    return `${num}%`;
};

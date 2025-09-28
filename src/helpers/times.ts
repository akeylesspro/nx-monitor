import { Timestamp } from "firebase/firestore";
import moment from "moment-timezone";
import type { firebase_timestamp } from "akeyless-types-commons";
interface TimeToStringOptions {
    format?: string;
    fromFormat?: string;
    tz?: string;
    defaultReturnedValue?: string;
    debug?: boolean;
}
export function timestampToString(firebaseTimestamp: Timestamp | Date | string | firebase_timestamp, options?: TimeToStringOptions): string {
    const { defaultReturnedValue, format, fromFormat, tz, debug }: TimeToStringOptions = {
        defaultReturnedValue: options?.defaultReturnedValue ?? "-",
        format: options?.format ?? "DD/MM/YYYY HH:mm:ss",
        fromFormat: options?.fromFormat ?? "DD/MM/YYYY HH:mm:ss",
        tz: options?.tz,
        debug: options?.debug ?? false,
    };
    let date: Date;
    switch (true) {
        case !firebaseTimestamp: {
            return defaultReturnedValue;
        }
        case firebaseTimestamp instanceof Timestamp: {
            date = firebaseTimestamp.toDate();
            break;
        }
        case firebaseTimestamp instanceof Date: {
            date = firebaseTimestamp as Date;
            break;
        }
        case typeof firebaseTimestamp === "string": {
            const m = moment.utc(firebaseTimestamp, fromFormat);
            switch (m.isValid()) {
                case true:
                    date = m.toDate();
                    break;
                default:
                    return defaultReturnedValue;
            }
            break;
        }
        case !!(firebaseTimestamp as firebase_timestamp)._seconds: {
            const ft = firebaseTimestamp as firebase_timestamp;
            date = new Date(ft._seconds * 1000 + (ft._nanoseconds ?? 0) / 1000000);
            break;
        }
        case !!(firebaseTimestamp as any).seconds: {
            const ft: any = firebaseTimestamp as any;
            date = new Date(ft.seconds * 1000 + ft.nanoseconds / 1000000);
            break;
        }
        default: {
            if (debug) {
                console.error("Invalid timestamp format: ", firebaseTimestamp);
            }
            return defaultReturnedValue;
        }
    }
    switch (Boolean(tz)) {
        case true:
            return moment(date)
                .tz(tz as string)
                .format(format);
        default:
            return moment.utc(date).format(format);
    }
}
interface TimeToMillisOptions extends Omit<TimeToStringOptions, "defaultReturnedValue" | "format"> {
    defaultReturnedValue?: number;
}
export function timestampToMillis(firebaseTimestamp: Timestamp | Date | string | firebase_timestamp, options?: TimeToMillisOptions): number {
    const { defaultReturnedValue, fromFormat, tz, debug }: TimeToMillisOptions = {
        defaultReturnedValue: options?.defaultReturnedValue ?? 0,
        fromFormat: options?.fromFormat ?? "DD/MM/YYYY HH:mm:ss",
        tz: options?.tz,
        debug: options?.debug ?? false,
    };
    switch (true) {
        case !firebaseTimestamp: {
            return defaultReturnedValue;
        }
        case firebaseTimestamp instanceof Timestamp: {
            return firebaseTimestamp.toMillis();
        }
        case firebaseTimestamp instanceof Date: {
            const ms = firebaseTimestamp.getTime();
            return isNaN(ms) ? defaultReturnedValue : ms;
        }
        case typeof firebaseTimestamp === "string": {
            const m = tz ? moment.tz(firebaseTimestamp, fromFormat, tz) : moment.utc(firebaseTimestamp, fromFormat);
            switch (m.isValid()) {
                case true:
                    return m.valueOf();
                default:
                    return defaultReturnedValue;
            }
        }
        case !!(firebaseTimestamp as firebase_timestamp)._seconds: {
            const seconds = (firebaseTimestamp as firebase_timestamp)._seconds;
            const nanos = (firebaseTimestamp as firebase_timestamp)._nanoseconds ?? 0;
            return seconds * 1000 + Math.floor(nanos / 1000000);
        }
        case !!(firebaseTimestamp as any).seconds: {
            const seconds = (firebaseTimestamp as any).seconds;
            const nanos = (firebaseTimestamp as any).nanoseconds ?? 0;
            return seconds * 1000 + Math.floor(nanos / 1000000);
        }
        default: {
            if (debug) {
                console.error("Invalid timestamp format: ", firebaseTimestamp);
            }
            return defaultReturnedValue;
        }
    }
}
export function sortByTimestamp(a: Timestamp, b: Timestamp, reverse: boolean = false) {
    return reverse ? timestampToMillis(b) - timestampToMillis(a) : timestampToMillis(a) - timestampToMillis(b);
}

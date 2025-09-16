import type { Ref } from "vue";

export type Updater<T> = (current: T) => T;

export const setState = <T>(ref: Ref<T>, value: T | Updater<T>) => {
    if (typeof value === "function") {
        ref.value = (value as Updater<T>)(ref.value);
    } else {
        ref.value = value;
    }
};
export type SetState<T> = (value: T | Updater<T>) => ReturnType<typeof setState<T>>;

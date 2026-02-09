import { Preferences } from "@capacitor/preferences";

export const Storage = {
    async set(key, value) {
        await Preferences.set({ key, value });
    },

    async get(key) {
        const result = await Preferences.get({ key });
        return result.value;
    },

    async remove(key) {
        await Preferences.remove({ key });
    },

    async keys() {
        const result = await Preferences.keys();
        return result.keys;
    }
};

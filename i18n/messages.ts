import en from "@/messages/en.json";
import zhHant from "@/messages/zh-Hant.json";
import type { Locale } from "./routing";

export const messages = { en, "zh-Hant": zhHant } as const;
export function getMessages(locale: Locale) { return messages[locale]; }

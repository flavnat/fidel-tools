import { Pipeline } from "@fidel-tools/core";
import amPack from "@fidel-tools/lang-am/am.json";

export const nlp = new Pipeline(amPack as any);

import { Dexie, type EntityTable } from "dexie";
import type { z } from "zod";

import type { receiptSchema } from "@/schemas/receiptSchema";

interface Receipt extends z.infer<typeof receiptSchema> {
	id: string;
	image: Blob;
}

export const db = new Dexie("receiptDatabase") as Dexie & {
	receipts: EntityTable<Receipt, "id">;
};

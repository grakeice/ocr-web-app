"use client";

import type { JSX, PropsWithChildren } from "react";

import { z } from "zod";
import { ja } from "zod/v4/locales";

export function ZodConfig({ children }: PropsWithChildren): JSX.Element {
	z.config(ja());
	return <>{children}</>;
}

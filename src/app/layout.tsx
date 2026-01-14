import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ZodConfig } from "@/components/common/zod-config";
import { ThemeProvider } from "@/components/ui/theme-provider";

import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "レシートOCR",
	description: "レシートなどの画像をOCRして、JSONやCSV形式で書き出せるアプリ",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ZodConfig>
					<ThemeProvider
						attribute={"class"}
						defaultTheme={"system"}
						enableSystem
						disableTransitionOnChange
					>
						{children}
					</ThemeProvider>
				</ZodConfig>
			</body>
		</html>
	);
}

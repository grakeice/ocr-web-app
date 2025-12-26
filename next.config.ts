import type { NextConfig } from "next";

import "@/env";

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	experimental: {
		serverActions: {
			bodySizeLimit: "5mb",
		},
	},
};

export default nextConfig;

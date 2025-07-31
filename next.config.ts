import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	webpack: (config) => {
		config.resolve.alias["mongoose"] = require.resolve("mongoose");
		return config;
	},
};

export default nextConfig;

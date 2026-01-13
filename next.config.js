/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        "utf-8-validate": "commonjs utf-8-validate",
        bufferutil: "commonjs bufferutil",
        "supports-color": "commonjs supports-color",
        mysql2: "commonjs mysql2",
        sequelize: "commonjs sequelize",
      });
    }
    return config;
  },
};

module.exports = nextConfig;

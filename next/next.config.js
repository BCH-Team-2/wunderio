const { i18n } = require("./next-i18next.config");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [process.env.NEXT_IMAGE_DOMAIN],
  },
  i18n,
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/sitemap.xml",
          destination: `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/sites/default/files/sitemap.xml`,
        },
        {
          //We need this because we use node:title as a path pattern and the Finnish and Swedish versions of the Career node have different titles.
          source: "/tyourat",
          destination: "/careers",
        },
        {
          source: "/karriar",
          destination: "/careers",
        },
        {
          source: "/services",
          destination: "/services",
        },
        {
          source: "/palvelut",
          destination: "/services",
        },
        {
          source: "/tjänster",
          destination: "/services",
        },
        {
          source: "/ota-yhteytta",
          destination: "/contact-us",
        },
        {
          source: "/kontakta-oss",
          destination: "/contact-us",
        },
        {
          source: "/contact-us",
          destination: "/contact-us",
        },
        {
          source: "/tyo",
          destination: "/work",
        },
        {
          source: "/arbete",
          destination: "/work",
        },
        {
          source: "/tietoa-meista",
          destination: "/about",
        },
        {
          source: "/om-oss",
          destination: "/about",
        },
      ],
    };
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.tsx$/i,
      loader: "@svgr/webpack",
    });
    return config;
  },
};

module.exports = nextConfig;

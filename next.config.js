/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
      domains: ['use.ink'],
      dangerouslyAllowSVG: true,
      contentDispositionType: 'attachment',
      contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    webpack(config) {
      // SVG Configuration
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      });
  
      return config;
    },
    // Optimize for production builds
    compiler: {
      removeConsole: process.env.NODE_ENV === 'production',
    },
    // Enable experimental features for app directory
    experimental: {
      optimizeCss: true,
      scrollRestoration: true,
    },
    // Polyfill for Node.js crypto module
    transpilePackages: ['framer-motion'],
    // Metadata for the app
    env: {
      NEXT_PUBLIC_APP_NAME: 'ink!CTF',
      NEXT_PUBLIC_APP_DESCRIPTION: 'Capture The Flag for ink! Smart Contracts',
    }
  };
  
module.exports = nextConfig;
  
declare module 'next-pwa' {
    import type { NextConfig } from 'next';
    type PWAConfig = {
        dest: string;
        register?: boolean;
        skipWaiting?: boolean;
        disable?: boolean;
        buildExcludes?: string[];
        [key: string]: any;
    };
    const withPWA: (config: PWAConfig) => (nextConfig: NextConfig) => NextConfig;
    export default withPWA;
}

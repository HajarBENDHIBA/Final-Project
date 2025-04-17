const config = {
    api: {
        baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://backend-green-heaven.vercel.app/api',
        timeout: parseInt(process.env.NEXT_PUBLIC_TIMEOUT) || 30000,
        retryCount: parseInt(process.env.NEXT_PUBLIC_RETRY_COUNT) || 3,
        retryDelay: parseInt(process.env.NEXT_PUBLIC_RETRY_DELAY) || 2000
    }
};

export default config; 
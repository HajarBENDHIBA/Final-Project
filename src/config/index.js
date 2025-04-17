const config = {
    api: {
        baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://backend-green-heaven-93tp0klhj-hajar-bendhibas-projects.vercel.app/api',
        timeout: parseInt(process.env.NEXT_PUBLIC_TIMEOUT || '30000', 10),
        retryCount: parseInt(process.env.NEXT_PUBLIC_RETRY_COUNT) || 3,
        retryDelay: parseInt(process.env.NEXT_PUBLIC_RETRY_DELAY) || 2000
    },
    auth: {
        tokenKey: 'token',
        roleKey: 'role',
        loginKey: 'isLoggedIn'
    }
};

export default config; 
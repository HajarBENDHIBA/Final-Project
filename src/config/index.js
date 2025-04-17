const config = {
    api: {
        baseURL: 'https://backend-green-heaven-93tp0klhj-hajar-bendhiba.vercel.app/api',
        timeout: 30000,
        retryCount: 3,
        retryDelay: 2000
    },
    auth: {
        tokenKey: 'token',
        roleKey: 'role',
        loginKey: 'isLoggedIn'
    }
};

export default config; 
const config = {
  api: {
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 30000,
    retryCount: 3,
    retryDelay: 2000,
  },
  auth: {
    tokenKey: "token",
    roleKey: "role",
    loginKey: "isLoggedIn",
  },
};

export default config;

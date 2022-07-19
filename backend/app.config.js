const config = {
    auth: {
        google: {
            clientId:
                process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            redirectUri: process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/callback/google",
            tokenEndpoint: "https://oauth2.googleapis.com/token",
            scope: "openid",
        },

        // oid: {
        //     clientId:
        //         process.env.OID_CLIENT_ID || "mycid",
        //     clientSecret: process.env.OID_CLIENT_SECRET || "mycsecret",
        //     redirectUri: process.env.OID_REDIRECT_URI || "http://localhost:3000/callback/oid",
        //     tokenEndpoint: "http://localhost:4000/api/user/token",
        //     scope: "openid",
        // },

        // github: {
        //     clientId: process.env.GITHUB_CLIENT_ID,
        //     clientSecret: process.env.GITHUB_CLIENT_SECRET,
        //     redirectUri: process.env.GITHUB_REDIRECT_URI || "http://localhost:3000/callback/github",
        //     tokenEndpoint: "https://github.com/login/oauth/access_token",
        //     scope: "user",
        //     userEndpoint: "https://api.github.com/user", // need this if provider is OAuth compatible only
        //     user_id: "id",
        // },
    },
};

module.exports = config;
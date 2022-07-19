const _config = {
    dev: {
        reddit: "http://localhost:8080/api",
        google: {
            client_id: "857791713704-fks0eph2u1hgl8k5eqluck1multdmjvi.apps.googleusercontent.com",
            base_url: "https://accounts.google.com/o/oauth2/v2/auth",
        },
        oid: {
            client_id: "mycid",
            base_url: "http://localhost:3000",
        },
    },
    prod: {
        reddit: process.env.REACT_APP_REDDIT || "https://coral-app-k8s8r.ondigitalocean.app/api",
        google: {
            client_id: process.env.REACT_APP_CLIENT_ID || "857791713704-fks0eph2u1hgl8k5eqluck1multdmjvi.apps.googleusercontent.com",
            base_url: process.env.REACT_APP_GOOGLEBASEURL || "https://accounts.google.com/o/oauth2/v2/auth",
        },
    },
}

const config = process.env.NODE_ENV === "development" ? _config.dev : _config.prod;

export default config;
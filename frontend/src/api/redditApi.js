import http from "axios";
import config from "../app.config";

export const redditApi = () => {
    const instance = http.create({
        baseURL: config.reddit,
        timeout: 3000,
    });

    const post = async (path, data) => {
        try {
            const response = await instance.post(path, data, {
                headers: {
                    authorization: localStorage.getItem("token"),
                }
            });
            return response;
        } catch (err) {
            if (!err.response) return err;
            return err.response;
        }
    };

    const del = async (path, data) => {
        try {
            const response = await instance.delete(path, {
                headers: {
                    authorization: localStorage.getItem("token"),
                },
                data: data,
            });
            return response;
        } catch (err) {
            if (!err.response) return err;
            return err.response;
        }
    };

    const patch = async (path, data) => {
        try {
            const response = await instance.patch(path, data, {
                headers: {
                    authorization: localStorage.getItem("token"),
                }
            });
            return response;
        } catch (err) {
            if (!err.response) return err;
            return err.response;
        }
    };

    const get = async (path) => {
        try {
            const response = await instance.get(path, {
                headers: {
                    authorization: localStorage.getItem("token"),
                }
            });
            return response;
        } catch (err) {
            if (!err.response) return err;
            return err.response;
        }
    };
    return { post, del, patch, get, _instance: instance }; // _private_stuff
};

// module.exports = redditApi();

/*

*/
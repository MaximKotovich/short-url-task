import defaultAxios from 'axios'

export const axios = defaultAxios.create({
    baseURL: `${process.env.REACT_APP_BACK_URL}`,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true,
});

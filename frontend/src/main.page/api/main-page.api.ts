import {axios} from "../../common/default.api";
import {IGetShortUrl, IPagination} from "../interfaces/request.interfase";


export const getShortUrl = async (payload:IGetShortUrl) => {
    const result = await axios.post('/shorten', payload)
    return result.data
}

export const getListOfUrls = async (payload:IPagination) => {
    const result = await axios.post('/links-list', payload)
    return result.data
}
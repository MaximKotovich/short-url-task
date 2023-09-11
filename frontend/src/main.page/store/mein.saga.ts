import {call, put, takeEvery } from "redux-saga/effects";
import {
    GET_LIST_OF_URL_REQUEST,
    GET_SHORT_URL_REQUEST,
    SET_LIST_OF_URL,
    SET_SHORT_URL,
    SET_TOTAL_COUNT
} from "./main.action";
import {getListOfUrls, getShortUrl} from "../api/main-page.api";


function * getShortUrlRequest ({ payload }: ReturnType<any>) {
    // @ts-ignore
    const response:any = yield call(getShortUrl, payload)
    yield put({ type: SET_SHORT_URL, payload: response.shortUrl })
}

function * getListOfUrlsRequest ({ payload }: ReturnType<any>) {
    // @ts-ignore
    const response:any = yield call(getListOfUrls, payload)
    yield put({ type: SET_LIST_OF_URL, payload: response.data })
    yield put({ type: SET_TOTAL_COUNT, payload: response.totalCount })
}



export function * sagaMain () {
    yield takeEvery(GET_SHORT_URL_REQUEST, getShortUrlRequest)
    yield takeEvery(GET_LIST_OF_URL_REQUEST, getListOfUrlsRequest)
}

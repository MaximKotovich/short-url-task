import {SET_LIST_OF_URL, SET_SHORT_URL, SET_TOTAL_COUNT} from "./main.action";


interface IState {
    shortUrl: string,
    listOfUrls: any[],
    totalCount: number
}

const initialState: IState = {
    shortUrl: '',
    listOfUrls: [],
    totalCount: 0
}


export const mainReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case SET_SHORT_URL: {
            return {
                ...state,
                shortUrl: `${process.env.REACT_APP_BACK_URL}/${action.payload}`
            }
        }
        case SET_LIST_OF_URL: {
            return {
                ...state,
                listOfUrls: action.payload
            }
        }
        case SET_TOTAL_COUNT: {
            return {
                ...state,
                totalCount: action.payload
            }
        }

        default: return state
    }
}

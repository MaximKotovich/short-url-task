import { combineReducers } from 'redux'
import {mainReducer} from "../main.page/store/main.reducer";


export type RootState = ReturnType<typeof rootReducer>

const rootReducer = combineReducers({
    mainReducer
})

export default rootReducer

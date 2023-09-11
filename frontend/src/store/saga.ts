import { spawn } from 'redux-saga/effects'
import {sagaMain} from "../main.page/store/mein.saga";

export default function * rootSaga () {
  yield spawn(sagaMain)
}

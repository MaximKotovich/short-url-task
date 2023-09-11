import React, {useEffect, useState} from 'react';
import './main.page.scss'
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store/reducers";
import {IGetShortUrl, IPagination} from "./interfaces/request.interfase";
import {GET_LIST_OF_URL_REQUEST, GET_SHORT_URL_REQUEST} from "./store/main.action";
import {Button, Pagination, Paper, TextField} from "@mui/material";


export const MainPage = () => {
    const shortUrl = useSelector((state: RootState) => state.mainReducer.shortUrl)
    const totalCount = useSelector((state: RootState) => state.mainReducer.totalCount)
    const listOfUrls = useSelector((state: RootState) => state.mainReducer.listOfUrls)

    const [urlTextField, setUrlTextField] = useState<string>('')
    const [subPartValue, setSubPartValue] = useState<string>('')
    const [pagination, setPagination] = useState<IPagination>({ limit: 10, offset: 0})
    const [validationUrl, setValidationUrl] = useState<boolean>(false)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch({type: GET_LIST_OF_URL_REQUEST, payload: pagination})
    }, [pagination])

    const changeOriginalUrl = (url: string) => {
        const isUrl = url.match(/https?:\/\/(www\.)?[-a-zA-Z0–9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0–9@:%_\+.~#()?&//=]*)/)
        !isUrl ? setValidationUrl(true) : setValidationUrl(false)
        setUrlTextField(url)
    }
    const changeSubPart = (value: string) => {
        setSubPartValue(value)
    }

    const sendUrlForCutting = () => {
        if (validationUrl) return
        const payload: IGetShortUrl = {
            originalUrl: urlTextField,
        }
        if(subPartValue) {
            payload.subpart = subPartValue
        }
        dispatch({type: GET_SHORT_URL_REQUEST, payload})
    }

    const changePagination = (value:number) => {
        setPagination({...pagination, offset: (value-1) * pagination.limit})
    }
  return (
            <div className={"content"}>
                <div className={"inputs-container"}>
                    <div className={"text-field-panel"}>
                        <TextField
                            classes={{
                                root: 'main-text-field'
                            }}
                            error = {validationUrl}
                            helperText={validationUrl ? "validation error" : ""}
                            required
                            label="Enter your url"
                            variant="outlined"
                            fullWidth
                            onChange={(e) => changeOriginalUrl(e.target.value)}
                        />
                        <TextField
                            classes={{
                                root: 'main-text-field'
                            }}
                            label="Enter preferred subpart"
                            variant="outlined"
                            fullWidth
                            onChange={(e) => changeSubPart(e.target.value)}
                        />
                        <Button variant="contained" onClick={sendUrlForCutting} >Send</Button>
                    </div>
                    <TextField
                        classes={{
                        root: 'result-text-field'
                        }}
                       label="Result"
                       variant="outlined"
                       fullWidth
                       disabled
                       value={shortUrl}
                    />
                </div>
                <div className={"table-container"}>
                    <div className={'table-content'}>
                        {listOfUrls.map((item:any) =>
                            <Paper
                                key={item._id}
                                elevation={3}
                                classes={{
                                    root: 'paper'
                                }}
                            > {item.originalUrl} - <a href={`${process.env.REACT_APP_BACK_URL}/${item.shortUrl}`} target='_blank' rel="noreferrer">{`${process.env.REACT_APP_BACK_URL}/${item.shortUrl}`}</a> </Paper>)}
                        <Pagination classes={{
                            root: 'pagination'
                        }} count={Math.ceil(totalCount/10)} onChange={(e, value) => changePagination(value)}/>
                    </div>
                </div>
            </div>
  );
}


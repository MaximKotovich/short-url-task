import React from 'react';
import './app.scss'
import {MainPage} from "./main.page/main.page";

export const App = () => {

  return (
    <div className={"main"}>
        <div className={"container"}>
            <MainPage/>
        </div>
    </div>
  );
}


import Main from './Main';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
const styles = require("./css/main.scss");
ReactDOM.render(
    <Main compiler="TypeScript" framework="React" />,
    document.getElementById("app")
);
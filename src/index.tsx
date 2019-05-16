import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './App';
import { runStaticServer } from './project';






async function run() {
    const div = document.getElementById("app")!;
    ReactDOM.render(<App />, div)
}

run();
runStaticServer();

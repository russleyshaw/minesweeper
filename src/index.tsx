import "core-js/stable";
import "regenerator-runtime/runtime";
import "./style.scss";

import * as React from "react";
import { render } from "react-dom";
import styled, { createGlobalStyle } from "styled-components";
import AppView from "./views/AppView";
import { COLORS } from "./constants";

const GlobalStyle = createGlobalStyle`
    html, body, #react-root {
        padding: 0;
        margin: 0;
        font-family: 'Overpass', sans-serif;

        background-color: ${COLORS.black};
        color: ${COLORS.lightGrey};
    }

    #react-root {
        display: flex;
        flex-direction: column;
    }
`;

render(
    <React.Fragment>
        <GlobalStyle />
        <AppView />
    </React.Fragment>,
    document.getElementById("react-root")
);

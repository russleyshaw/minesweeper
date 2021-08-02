import { observer } from "mobx-react";
import * as React from "react";
import styled, { css } from "styled-components";
import { TileModel } from "../models/TileModel";

import { faFlag, faBomb } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { COLORS } from "../constants";

export interface TileButtonProps {
    model: TileModel;
    disabled?: boolean;

    onReveal?(): void;
    onFlag?(): void;
}

const REVEALED_CSS = css`
    background-color: ${COLORS.lightGrey};
`;

const Button = styled.button<{ mine?: boolean; revealed?: boolean; flag?: boolean }>`
    height: 32px;

    transition: background-color 300ms;

    text-align: center;
    line-height: 50%;
    border: ${COLORS.black} 1px solid;

    background-color: ${COLORS.darkGrey};

    ${p => p.revealed && REVEALED_CSS}
`;

export default observer((props: TileButtonProps) => {
    const { model } = props;

    return (
        <Button
            revealed={model.revealed}
            mine={model.mine}
            flag={model.flag}
            disabled={props.disabled}
            onClick={onClick}
            onContextMenu={onRightClick}
        >
            {getContents()}
        </Button>
    );

    function getContents() {
        if (model.revealed && model.mine) {
            return <FontAwesomeIcon icon={faBomb} color={COLORS.danger} />;
        }
        if (model.flag && !model.revealed) {
            return <FontAwesomeIcon icon={faFlag} color={COLORS.accent} />;
        }
        if (model.revealed && model.nearbyMines > 0) {
            return `${model.nearbyMines}`;
        }
        return "";
    }

    function onClick(e: React.MouseEvent) {
        props.onReveal?.();
    }

    function onRightClick(e: React.MouseEvent) {
        e.preventDefault();
        props.onFlag?.();
    }
});

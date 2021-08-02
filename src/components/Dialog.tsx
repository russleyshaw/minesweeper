import * as React from "react";
import styled from "styled-components";
import { COLORS } from "../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export interface DialogProps {
    open?: boolean;
    title?: string;
    children?: React.ReactNode;

    onClose?(): void;
}

const BackdropDiv = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgb(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ModalDiv = styled.div`
    background-color: ${COLORS.darkGrey};

    margin-top: 10%;
    padding: 8px;
    border-radius: 4px;
    width: 400px;

    border: ${COLORS.accent} 1px solid;
    box-shadow: 4px 4px 6px 0px rgba(0, 0, 0, 0.5);
`;

const Heading = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-bottom: 8px;
    margin-bottom: 8px;
    border-bottom: ${COLORS.black} 2px solid;
`;

export default function Dialog(props: DialogProps): JSX.Element | null {
    if (!props.open) return null;

    return (
        <React.Fragment>
            <BackdropDiv>
                <ModalDiv>
                    <Heading>
                        <div>{props.title}</div>
                        {props.onClose == null ? (
                            <span></span>
                        ) : (
                            <button onClick={() => props.onClose?.()}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        )}
                    </Heading>
                    {props.children}
                </ModalDiv>
            </BackdropDiv>
        </React.Fragment>
    );
}

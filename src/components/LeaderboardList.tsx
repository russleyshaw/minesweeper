import * as React from "react";
import { observer } from "mobx-react";
import { LeaderboardEntry } from "../models/AppModel";
import * as _ from "lodash";
import { COLORS } from "../constants";
import styled from "styled-components";

export interface LeaderboardListProps {
    name: string;
    leaders: LeaderboardEntry[];
}

const RootDiv = styled.div`
    border: ${COLORS.accent} 1px solid;
    width: 200px;
    margin: 16px;
    padding: 16px;
`;

const EntriesDiv = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
`;

export default observer((props: LeaderboardListProps) => {
    const sortedLeaders = _.take(
        _.sortBy(props.leaders, v => v.elapsed),
        10
    );

    return (
        <RootDiv>
            <h3>{props.name}</h3>
            <EntriesDiv>
                {sortedLeaders.map(l => (
                    <React.Fragment>
                        <span>{l.name}</span>
                        <span>{l.elapsed} sec</span>
                    </React.Fragment>
                ))}
            </EntriesDiv>
        </RootDiv>
    );
});

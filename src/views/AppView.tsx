import * as React from "react";
import { useState } from "react";
import { observer } from "mobx-react";
import { AppModel } from "../models/AppModel";
import TileButton from "../components/TileButton";
import styled from "styled-components";
import { COLORS, DIFFICULTIES } from "../constants";
import Dialog from "../components/Dialog";
import IntegerInput from "../components/IntegerInput";
import LeaderboardList from "../components/LeaderboardList";

const AppViewDiv = styled.div`
    width: 1000px;
    align-self: center;
    display: flex;
    flex-direction: column;
`;

const TilesGrid = styled.div`
    align-self: center;
    display: grid;
`;

const TitleHeading = styled.h1`
    color: ${COLORS.accent};
`;

const OptionsHeading = styled.div`
    margin-bottom: 16px;
`;

const InfoHeading = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 8px;
`;

const GameOptionsDiv = styled.div`
    display: grid;
    grid-template-columns: 1fr auto auto auto;
    gap: 8px 8px;
    margin-bottom: 8px;
`;

const LeaderboardsSection = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

export default observer(() => {
    const [appModel] = useState(() => new AppModel());
    const [isGameOpen, setGameOpen] = useState(false);

    const leaderboards = appModel.leaderboards.get();

    const gridTemplateRows = `repeat(${appModel.tiles.height}, 32px)`;
    const gridTemplateColumns = `repeat(${appModel.tiles.width}, 32px)`;

    return (
        <AppViewDiv>
            <TitleHeading>Minesweeper</TitleHeading>
            <OptionsHeading>
                <button onClick={() => setGameOpen(true)}>Game Options</button>
                <button onClick={() => appModel.flagAllMines()}>Cheat!</button>
            </OptionsHeading>
            <Dialog open={isGameOpen} onClose={() => setGameOpen(false)}>
                <GameOptionsDiv>
                    <span></span>
                    <span>Height</span>
                    <span>Width</span>
                    <span>Mines</span>

                    {DIFFICULTIES.map(diff => (
                        <React.Fragment>
                            <button
                                disabled={appModel.isNewGameOptionsMatched(
                                    diff.width,
                                    diff.height,
                                    diff.mines
                                )}
                                onClick={() =>
                                    appModel.setNewGameOptions(diff.width, diff.height, diff.mines)
                                }
                            >
                                {diff.name}
                            </button>
                            <span>{diff.height}</span>
                            <span>{diff.width}</span>
                            <span>{diff.mines}</span>
                        </React.Fragment>
                    ))}

                    <button>Custom</button>
                    <IntegerInput
                        min={4}
                        max={100}
                        value={appModel.newGameHeight}
                        onChange={v => (appModel.newGameHeight = v)}
                    />
                    <IntegerInput
                        min={4}
                        max={100}
                        value={appModel.newGameWidth}
                        onChange={v => (appModel.newGameWidth = v)}
                    />
                    <IntegerInput
                        min={1}
                        max={200}
                        value={appModel.newGameMines}
                        onChange={v => (appModel.newGameMines = v)}
                    />
                </GameOptionsDiv>
                <button
                    onClick={() => {
                        setGameOpen(false);
                        appModel.newGame();
                    }}
                >
                    New Game
                </button>
            </Dialog>

            <InfoHeading>
                <span>Flags: {appModel.flagsRemaining}</span>
                <button onClick={() => appModel.newGame()}>Reset</button>
                <span>Elapsed: {appModel.secondsElapsed}</span>
            </InfoHeading>

            <TilesGrid style={{ gridTemplateColumns, gridTemplateRows }}>
                {appModel.tiles.map((x, y, t) => (
                    <TileButton
                        key={`${x}_${y}`}
                        onReveal={() => appModel.revealTile(x, y)}
                        onFlag={() => appModel.toggleFlagTile(t)}
                        model={t}
                    />
                ))}
            </TilesGrid>

            <LeaderboardsSection>
                <LeaderboardList name="Expert" leaders={leaderboards.expert} />
                <LeaderboardList name="Intermediate" leaders={leaderboards.intermediate} />
                <LeaderboardList name="Beginner" leaders={leaderboards.beginner} />
            </LeaderboardsSection>
        </AppViewDiv>
    );
});

import { Box, Text, createStyles, Grid, Highlight } from "@mantine/core";
import { useEffect } from "react";
import { CaptionType } from "../types";
import { hms } from "../utils";

const useStyles = createStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "start",
        gap: 10,
        height: "70vh",
        overflowY: "auto",
        overflowX: "hidden",
        scrollBehavior: "smooth",
        boxShadow: theme.shadows.xl,
        border: `1px solid ${theme.colors.gray[2]}`,
    },

    captions: {
        width: "100%",
        paddingLeft: theme.spacing.xl,
        paddingRight: theme.spacing.xl,
        cursor: "pointer",
    },

    currentCaption: {
        paddingLeft: theme.spacing.xl,
        paddingRight: theme.spacing.xl,
        width: "100%",
        background: theme.colors.orange[0],
        fontWeight: "bold",
        cursor: "pointer",
    },

    time: {
        color:
            theme.colorScheme === "dark"
                ? theme.colors.dark[0]
                : theme.colors.gray[7],
    },
}));

type LineType = {
    text: string;
    start: number;
    isCurrent: boolean;
    query: string;
    onClick: () => void;
};
const Line = ({ text, start, isCurrent, query, onClick }: LineType) => {
    const { classes } = useStyles();

    useEffect(() => {
        if (isCurrent) {
            // Scroll to current caption if it is current
            const element = document.getElementById(hms(start));
            if (element) {
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }
        }
    }, [isCurrent]);

    return (
        <Grid
            columns={12}
            className={isCurrent ? classes.currentCaption : classes.captions}
            onClick={onClick}
        >
            <Grid.Col className={classes.time} span={4}>
                <span id={hms(start)}>{hms(start)}</span>
            </Grid.Col>
            <Grid.Col span={8}>
                <Highlight highlight={query} highlightColor="orange">
                    {text}
                </Highlight>
            </Grid.Col>
        </Grid>
    );
};

type CaptionsType = {
    captions: CaptionType[];
    second: number;
    query: string;
    setTime: (time: number) => void;
};
const Captions = ({ captions, second, query, setTime }: CaptionsType) => {
    const { classes } = useStyles();

    return (
        <Box className={classes.root}>
            {captions.map((caption, index) => {
                const isCurrent =
                    second >= caption.start_time && second < caption.end_time;
                return (
                    <Line
                        key={index}
                        text={caption.text}
                        start={caption.start_time}
                        isCurrent={isCurrent}
                        query={query}
                        onClick={() => setTime(caption.start_time)}
                    />
                );
            })}
        </Box>
    );
};

export default Captions;

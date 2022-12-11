import { Box, createStyles, Highlight } from "@mantine/core";
import { hms } from "../utils";

const useStyles = createStyles((theme) => ({
    moment: {
        paddingLeft: theme.spacing.xl,
        paddingRight: theme.spacing.xl,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "300px",
        flexShrink: 0,
        paddingTop: theme.spacing.md,
        paddingBottom: theme.spacing.md,

        "&:hover": {
            background: theme.colors.gray[0],
        },
    },

    time: {
        color: theme.colors.gray[7],
    },
}));

type MomentType = {
    text: string;
    start: number;
    query: string;
    onClick: (time: number) => void;
};
const Moment = ({ text, start, query, onClick }: MomentType) => {
    const { classes } = useStyles();

    const findHighlight = () => {
        const terms = query.split(" ");
        const words = text.split(" ");

        for (let i = 0; i < words.length; i++) {
            if (terms.includes(words[i])) {
                let start = Math.max(0, i - 2);
                let end = Math.min(words.length, start + 4);
                let prefix = start > 0 ? "..." : "";
                let suffix = end < words.length ? "..." : "";
                return prefix + words.slice(start, end).join(" ") + suffix;
            }
        }
        return text;
    };

    return (
        <Box className={classes.moment} onClick={() => onClick(start)}>
            <Box className={classes.time}>
                <span id={hms(start)}>{hms(start)}</span>
            </Box>
            <Box>
                <Highlight highlight={query.split(" ")} highlightColor="orange">
                    {findHighlight()}
                </Highlight>
            </Box>
        </Box>
    );
};

export default Moment;

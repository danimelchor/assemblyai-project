import { Grid, createStyles, Text, Box, RingProgress } from "@mantine/core";
import axios from "axios";
import { CSSProperties, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, HandStop, X } from "tabler-icons-react";
import { SearchResultsType } from "../types";
import { numToPct, statusToColor } from "../utils";

const useStyles = createStyles((theme) => ({
    videoBox: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: theme.spacing.md,
        marginTop: theme.spacing.md,
        position: "relative",
        padding: theme.spacing.md,
        borderRadius: theme.radius.sm,
    },

    img: {
        borderRadius: theme.radius.sm,
        overflow: "hidden",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
    },

    videoTitle: {
        color: theme.colorScheme === "dark" ? "#ccc" : "#666",
        fontSize: theme.fontSizes.sm,
        overflow: "hidden",
        width: "100%",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        marginTop: theme.spacing.xs,
    },

    StatusBadge: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        borderRadius: theme.radius.sm,
    },
}));

const StatusBadge = ({
    status,
    progress,
}: {
    status: string;
    progress?: number;
}) => {
    const { classes } = useStyles();

    let icon;
    let text;

    if (status == "PENDING") {
        icon = <HandStop size={80} strokeWidth={1} color={"gray"} />;
        text = "Pending";
    } else if (status == "PROGRESS") {
        icon = (
            <RingProgress
                sections={[{ value: (progress || 0) * 100, color: "orange" }]}
                size={80}
                thickness={6}
                label={
                    <Text color="orange" weight={700} align="center" size="md">
                        {numToPct(progress || 0)}
                    </Text>
                }
            />
        );
        text = "Processing";
    } else if (status == "FAILURE") {
        icon = <X size={80} strokeWidth={1} color={"red"} />;
        text = "Failed";
    } else if (status == "SUCCESS") {
        icon = <Check size={80} strokeWidth={1} color={"green"} />;
        text = "Success";
    }

    return (
        <Box className={classes.StatusBadge}>
            {icon}
            <Text color="white" weight={700} align="center" size="md">
                {text}
            </Text>
        </Box>
    );
};

const linkStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
} as CSSProperties;

type PreviewProps = {
    searchResult: SearchResultsType;
    query: string;
};
const Preview = ({ searchResult, query }: PreviewProps) => {
    const { classes } = useStyles();
    const [src, setSrc] = useState("");
    const [hover, setHover] = useState(false);

    useEffect(() => {
        // Load image from server and get blob
        axios.get(`/thumbnail/${searchResult.id}`).then((res) => {
            // Set the image src to the object URL.
            setSrc(res.data.src);
        });
    }, []);

    return (
        <Grid.Col
            span={3}
            className={classes.videoBox}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {src && (
                <Box className={classes.img}>
                    <img
                        src={src}
                        style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "contain",
                        }}
                    />
                </Box>
            )}
            <Text className={classes.videoTitle}>{searchResult.filename}</Text>
            {hover && (
                <StatusBadge
                    status={searchResult.status}
                    progress={searchResult.progress}
                />
            )}
            {searchResult.status == "SUCCESS" && (
                <Link
                    style={linkStyle}
                    to={`/video/${searchResult.id}?q=${query}`}
                ></Link>
            )}
        </Grid.Col>
    );
};

export default Preview;

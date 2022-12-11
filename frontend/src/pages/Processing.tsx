import { Box, createStyles, Grid, Title, Text } from "@mantine/core";

import { useEffect, useState } from "react";
import axios from "axios";
import Preview from "../components/Preview";
import { SearchResultsType } from "../types";

const useStyles = createStyles((theme) => ({
    root: {
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 90,
    },

    inputWrapper: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        position: "sticky",
        boxSizing: "border-box",
        backgroundColor: theme.white,
        height: 100,
        zIndex: 1,
        paddingLeft: 30,
        paddingRight: 30,
    },

    input: {
        width: "70%",
    },

    grid: {
        width: "70%",
    },
}));

const Processing = () => {
    const { classes } = useStyles();
    const [processingResults, setProcessingResults] = useState<
        SearchResultsType[]
    >([]);
    const [processedResults, setProcessedResults] = useState<
        SearchResultsType[]
    >([]);

    const fetchResults = async (interval?: NodeJS.Timeout) => {
        // Get the processing videos from the server
        const processing = await axios.get(`/processing`);
        setProcessingResults(processing.data.processing || []);
        setProcessedResults(processing.data.processed || []);

        let anyPending = false;
        for (const result of processing.data.processing) {
            if (result.status !== "FAILURE") {
                anyPending = true;
                break;
            }
        }

        if (!anyPending && interval) {
            clearInterval(interval);
        }
    };

    useEffect(() => {
        fetchResults();
        const interval = setInterval(() => {
            fetchResults(interval);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Box className={classes.root}>
            <Title order={1} mt="xl">
                Processing videos
            </Title>
            {processingResults.length === 0 && (
                <Text fz="lg">No videos currently being processed.</Text>
            )}
            {processingResults.length > 0 && (
                <Grid columns={12} className={classes.grid}>
                    {processingResults.map((result, key) => (
                        <Preview searchResult={result} key={key} query="" />
                    ))}
                </Grid>
            )}
            <Title order={1} mt="xl">
                Processed videos
            </Title>
            {processedResults.length === 0 && (
                <Text fz="lg">No videos have been processed yet.</Text>
            )}
            {processedResults.length > 0 && (
                <Grid columns={12} className={classes.grid}>
                    {processedResults.map((result, key) => (
                        <Preview searchResult={result} key={key} query="" />
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default Processing;

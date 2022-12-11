import { Box, createStyles, Grid, Title } from "@mantine/core";

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
        paddingTop: 60,
    },

    inputWrapper: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        position: "sticky",
        boxSizing: "border-box",
        backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        height: 100,
        zIndex: 1,
        paddingLeft: 30,
        paddingRight: 30,
    },

    input: {
        width: "70%",
    },

    grid: {
        overflowX: "hidden",
        overflowY: "auto",
        padding: 30,
        width: "70%",
    },
}));

const Search = () => {
    const { classes } = useStyles();
    const [searchResults, setSearchResults] = useState<SearchResultsType[]>([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        // Get query from URL params
        const params = new URLSearchParams(window.location.hash.split("?")[1]);
        let q = params.get("q") || "";
        setQuery(q);

        // Get the search results from the server
        axios
            .get(`/search?q=${q}`)
            .then((response) => {
                setSearchResults(response.data.results || []);
            })
            .catch((err) => {
                console.log("Error while searching");
                console.log(err);
            });
    }, []);

    return (
        <Box className={classes.root}>
            <Grid columns={12} className={classes.grid}>
                {searchResults.map((result, key) => (
                    <Preview searchResult={result} query={query} key={key} />
                ))}
                {searchResults.length === 0 && (
                    <Grid.Col span={12} sx={{ textAlign: "center" }}>
                        <Title order={2}>No videos found for "{query}"</Title>
                    </Grid.Col>
                )}
            </Grid>
        </Box>
    );
};

export default Search;

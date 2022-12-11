import { Box, createStyles, Image, Title, Text } from "@mantine/core";
import SearchBar from "../components/SearchBar";

import playButton from "../images/play-button.svg";

const useStyles = createStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        padding: 30,
        position: "relative",
        overflow: "hidden",
        background: "black",
    },

    title: {
        color: "white",
        marginBottom: theme.spacing.md,
    },

    subtitle: {
        color: "white",
    },

    form: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    },

    formWrapper: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
    },

    bgImage: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        opacity: 0.5,
    },

    playButton: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        opacity: 0.1,
    },
}));

function Home() {
    const { classes } = useStyles();

    return (
        <Box className={classes.root}>
            <Image
                className={classes.bgImage}
                src="https://source.unsplash.com/random?night"
            />
            <Image
                src={playButton}
                className={classes.playButton}
                width="50vh"
            />
            <Image
                src={playButton}
                className={classes.playButton}
                width="30vh"
            />
            <Image
                src={playButton}
                className={classes.playButton}
                width="10vh"
            />
            <Box className={classes.form}>
                <Box className={classes.formWrapper}>
                    <Title order={1} className={classes.title}>
                        ClipSearch
                    </Title>
                    <Text fz="xl" className={classes.subtitle}>
                        The intuitive video search engine.
                    </Text>
                    <Text fz="xl" className={classes.subtitle} mb="xl">
                        Powered by the latest AI technology.
                    </Text>
                    <SearchBar size="xl" variant="default" />
                </Box>
            </Box>
        </Box>
    );
}

export default Home;

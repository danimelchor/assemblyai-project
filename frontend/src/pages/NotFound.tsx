import { Anchor, Box, createStyles, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const useStyles = createStyles((theme) => ({
    root: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
        flexDirection: "column",
        paddingTop: 60,
    },

    title: {
        fontSize: "10em",
        fontWeight: 700,
    },
}));

const NotFound = () => {
    const { classes } = useStyles();
    const navigate = useNavigate();
    return (
        <Box className={classes.root}>
            <Title className={classes.title} color="orange">
                404
            </Title>
            <Title>Sorry, page not found</Title>
            <Anchor onClick={() => navigate("/")} color="blue" mt="xl">
                Go back to home
            </Anchor>
        </Box>
    );
};

export default NotFound;

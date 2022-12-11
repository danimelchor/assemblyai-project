import {
    Avatar,
    Box,
    Button,
    createStyles,
    Popover,
    Title,
    Anchor,
} from "@mantine/core";
import { CSSProperties } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Upload } from "tabler-icons-react";
import useUser from "../middlewares/authentication";
import SearchBar from "./SearchBar";

const useStyles = createStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: 60,
        backgroundColor: "white",
        boxShadow: theme.shadows.sm,
        paddingLeft: 20,
        paddingRight: 20,
        zIndex: 1,
        gap: 60,
    },

    organization: {
        textTransform: "capitalize",
    },

    avatarGroup: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
    },

    avatar: {
        cursor: "pointer",
    },

    popover: {
        paddingLeft: 0,
        paddingRight: 0,
        backgroundColor: theme.colors.orange[0],
    },

    popoverButtons: {
        color: "black",
        width: "100%",
        display: "flex",
        padding: "10px 20px",
        "&:hover": {
            backgroundColor: theme.colors.orange[1],
            textDecoration: "none",
        },
    },

    popoverButtonsLast: {
        color: "black",
        width: "100%",
        display: "flex",
        padding: "10px 20px",
        borderTop: `1px solid ${theme.colors.gray[3]}`,
        marginTop: 10,
        "&:hover": {
            backgroundColor: theme.colors.orange[1],
            textDecoration: "none",
        },
    },
}));

const titleStyle = {
    color: "black",
    textDecoration: "none",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "end",
    gap: 10,
} as CSSProperties;

const Navbar = () => {
    const { user, logout } = useUser();
    const { classes } = useStyles();
    const navigate = useNavigate();
    const upload = () => navigate("/upload");

    return (
        <Box className={classes.root}>
            <Link to="/" style={titleStyle}>
                <Title order={2}>VidLib</Title>
                {user && (
                    <Title
                        order={4}
                        className={classes.organization}
                        color="orange"
                    >
                        {user.organization}
                    </Title>
                )}
            </Link>

            <SearchBar size="md" variant="filled" />
            {user ? (
                <Box className={classes.avatarGroup}>
                    <Button
                        color="blue"
                        variant="light"
                        onClick={upload}
                        leftIcon={
                            <Upload size={20} strokeWidth={2} color="#228be6" />
                        }
                    >
                        Upload
                    </Button>
                    <Popover
                        width={200}
                        position="bottom"
                        withArrow
                        shadow="md"
                        classNames={{
                            dropdown: classes.popover,
                        }}
                    >
                        <Popover.Target>
                            <Avatar
                                radius="xl"
                                alt={user.email}
                                variant="filled"
                                color="orange"
                                className={classes.avatar}
                            >
                                {user.email[0].toUpperCase()}
                            </Avatar>
                        </Popover.Target>
                        <Popover.Dropdown>
                            <Anchor
                                className={classes.popoverButtons}
                                onClick={() => navigate("/processing")}
                            >
                                See my videos
                            </Anchor>
                            <Anchor
                                className={classes.popoverButtonsLast}
                                onClick={logout}
                            >
                                Logout
                            </Anchor>
                        </Popover.Dropdown>
                    </Popover>
                </Box>
            ) : (
                <Button variant="light" onClick={() => navigate("/login")}>
                    Login
                </Button>
            )}
        </Box>
    );
};

export default Navbar;

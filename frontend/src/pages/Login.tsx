import {
    Box,
    Button,
    createStyles,
    Text,
    TextInput,
    Title,
    Anchor,
} from "@mantine/core";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useUser from "../middlewares/authentication";

const useStyles = createStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
        backgroundColor: "#e5f3ff",
    },

    form: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 15,
        padding: 50,
        borderRadius: theme.radius.md,
        boxShadow: theme.shadows.xl,
        backgroundColor: "white",
    },

    errorMsg: {
        color: theme.colors.red[6],
    },
}));

const Login = () => {
    const { classes } = useStyles();
    const { setUser } = useUser();
    const navigate = useNavigate();

    const [error, setError] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios
            .post("/login", formData)
            .then((res) => {
                setUser(res.data);
                navigate("/");
            })
            .catch((err) => {
                console.log(err);
                setError(true);
            });
    };

    return (
        <Box className={classes.root}>
            <form onSubmit={handleSubmit}>
                <Box className={classes.form}>
                    <Title>Login</Title>
                    <TextInput
                        label="Email"
                        placeholder="Enter your business email"
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                email: e.currentTarget.value,
                            });
                        }}
                        size="lg"
                    />
                    <TextInput
                        label="Password"
                        placeholder="Enter your password"
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                password: e.currentTarget.value,
                            });
                        }}
                        type="password"
                        size="lg"
                    />
                    <Anchor onClick={() => navigate("/register")}>
                        Don't have an account?
                    </Anchor>
                    <Button type="submit" size="lg">
                        Login
                    </Button>
                    {error && (
                        <Text className={classes.errorMsg}>
                            Invalid username or password
                        </Text>
                    )}
                </Box>
            </form>
        </Box>
    );
};

export default Login;

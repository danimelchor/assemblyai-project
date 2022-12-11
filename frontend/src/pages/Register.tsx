import {
    Box,
    Button,
    createStyles,
    TextInput,
    Title,
    Anchor,
} from "@mantine/core";
import { useState } from "react";
import axios from "axios";
import { redirect, useNavigate } from "react-router-dom";
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
}));

const Register = () => {
    const { classes } = useStyles();
    const navigate = useNavigate();
    const { setUser } = useUser();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios
            .post("/register", formData)
            .then((res) => {
                setUser(res.data);
                navigate("/");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <Box className={classes.root}>
            <form onSubmit={handleSubmit}>
                <Box className={classes.form}>
                    <Title>Register</Title>
                    <TextInput
                        label="Email"
                        placeholder="Enter your business email"
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                email: e.currentTarget.value,
                            });
                        }}
                        type="email"
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
                    <Anchor onClick={() => navigate("/login")}>
                        Already have an account?
                    </Anchor>
                    <Button type="submit" size="lg">
                        Register
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default Register;

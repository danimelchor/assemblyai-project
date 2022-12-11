import { ActionIcon, createStyles, TextInput } from "@mantine/core";
import { Search as SearchIcon, X as XIcon } from "tabler-icons-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useStyles = createStyles((theme) => ({
    input: {
        width: "100%",
        ".mantine-TextInput-input": {
            borderWidth: "3px",
        },
    },
}));

const formStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
} as React.CSSProperties;

type SearchBarType = {
    size?: "md" | "xl";
    variant: "unstyled" | "default" | "filled";
};
const SearchBar = ({ size, variant }: SearchBarType) => {
    const { classes } = useStyles();
    const [focused, setFocused] = useState(false);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(
            window.location.hash.split("?")[1]
        );
        const q = urlParams.get("q");
        setQuery(q || "");
    }, [window.location.hash]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        // Search after pressing enter
        e.preventDefault();
        navigate(`/search?q=${query}`);
    };

    return (
        <form style={formStyle} onSubmit={handleSubmit}>
            <TextInput
                radius="xl"
                size={size}
                placeholder="Search for any video..."
                className={classes.input}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setQuery(e.target.value);
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                value={query}
                icon={
                    <SearchIcon
                        size={size == "xl" ? 30 : 22}
                        strokeWidth={focused ? 2.5 : 1.5}
                        color={focused ? "orange" : "gray"}
                    />
                }
                variant={
                    variant == "default"
                        ? "default"
                        : focused
                        ? "default"
                        : "filled"
                }
                rightSection={
                    query != "" ? (
                        <ActionIcon
                            variant="subtle"
                            onClick={() => setQuery("")}
                            radius="xl"
                            size={size}
                            style={{ marginRight: size == "xl" ? 20 : 10 }}
                        >
                            <XIcon
                                size={size == "xl" ? 30 : 22}
                                strokeWidth={1.5}
                                color="gray"
                            />
                        </ActionIcon>
                    ) : null
                }
            />
        </form>
    );
};

export default SearchBar;

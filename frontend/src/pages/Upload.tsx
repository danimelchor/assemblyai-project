import {
    Box,
    createStyles,
    Grid,
    Title,
    Image,
    Text,
    Button,
    Loader,
} from "@mantine/core";
import Dropzone from "react-dropzone";
import { useCallback, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import uploadImage from "../images/dropzone.png";
import audioImage from "../images/audio.jpeg";

const useStyles = createStyles((theme) => ({
    root: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        paddingTop: 60,
        backgroundColor: theme.colors.gray[0],
    },

    dropzone: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "90%",
        height: "90%",
        border: `2px dashed ${theme.colors.gray[5]}`,
        boxShadow: theme.shadows.lg,
        backgroundColor: "white",
    },

    emptyDropzone: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        width: "50%",
        height: "100%",
        textAlign: "center",
        cursor: "pointer",
        position: "relative",
    },

    fullDropzone: {
        width: "100%",
        height: "100%",
        padding: theme.spacing.xl,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "column",
    },

    inspired: {
        position: "absolute",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        marginBottom: theme.spacing.xl,
    },

    grid: {
        width: "100%",
        overflow: "hidden",
    },

    gridCol: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
    },

    videoBox: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },

    audioStyles: {
        margin: "0",
        overflow: "hidden",
        width: "100%",
        height: "auto",
        maxWidth: "200px",
        maxHeight: "200px",
    },

    videoTitle: {
        color: "#666",
        fontSize: theme.fontSizes.sm,
        width: "100%",
        textAlign: "center",
    },

    browse: {
        color: theme.colors.blue[5],
        cursor: "pointer",
        display: "inline-block",
    },

    uploadBox: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        flexDirection: "column",
        gap: 10,
        marginTop: theme.spacing.xl,
    },
}));

const dropzoneDivStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    flexDirection: "column",
} as React.CSSProperties;

const videoStyles = {
    margin: "0",
    overflow: "hidden",
    width: "100%",
    height: "auto",
} as React.CSSProperties;

const Upload = () => {
    const { classes } = useStyles();
    const navigate = useNavigate();
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);

    const upload = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Upload files to server
        const formData = new FormData();
        files.forEach((f) => {
            formData.append("files", f);
        });
        setUploading(true);
        axios.post("/upload", formData).then((res) => {
            setUploading(false);
            navigate("/processing");
        });
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Limit to only 5 files
        if (acceptedFiles.length > 5) {
            acceptedFiles = acceptedFiles.slice(0, 5);
        }
        setFiles(acceptedFiles);
    }, []);

    return (
        <Box className={classes.root}>
            <Box className={classes.dropzone}>
                <Dropzone
                    onDrop={onDrop}
                    accept={{
                        "video/mp4": [".mp4"],
                        "video/quicktime": [".mov"],
                        "audio/mp3": [".mp3"],
                    }}
                >
                    {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps()} style={dropzoneDivStyles}>
                            <input {...getInputProps()} />
                            {!uploading && files.length > 0 && (
                                <Box className={classes.fullDropzone}>
                                    <Grid
                                        grow
                                        columns={12}
                                        className={classes.grid}
                                    >
                                        {files.map((file) => (
                                            <Grid.Col
                                                span={4}
                                                className={classes.gridCol}
                                            >
                                                {file.type.includes("video") ? (
                                                    <video
                                                        src={URL.createObjectURL(
                                                            file
                                                        )}
                                                        width="100%"
                                                        height="100%"
                                                        style={videoStyles}
                                                    />
                                                ) : (
                                                    <Image
                                                        src={audioImage}
                                                        width="100%"
                                                        height="100%"
                                                        className={
                                                            classes.audioStyles
                                                        }
                                                    />
                                                )}
                                                <Text
                                                    className={
                                                        classes.videoTitle
                                                    }
                                                >
                                                    {file.name}
                                                </Text>
                                            </Grid.Col>
                                        ))}
                                    </Grid>
                                    <Box className={classes.uploadBox}>
                                        <Button size="lg" onClick={upload}>
                                            Upload
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                            {!uploading && files.length == 0 && (
                                <Box className={classes.emptyDropzone}>
                                    <Image src={uploadImage} width={150} />
                                    <Title order={2}>
                                        Drag and drop up to 6 videos or{" "}
                                        <Text className={classes.browse}>
                                            browse
                                        </Text>{" "}
                                        to choose a file
                                    </Title>

                                    <Text fz="xs" className={classes.inspired}>
                                        Heavily inspired by Unsplash
                                    </Text>
                                </Box>
                            )}
                            {uploading && (
                                <Box className={classes.emptyDropzone}>
                                    <Loader />
                                </Box>
                            )}
                        </div>
                    )}
                </Dropzone>
            </Box>
        </Box>
    );
};

export default Upload;

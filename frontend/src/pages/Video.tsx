import { Box, createStyles, Grid } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Captions from "../components/Captions";
import { CaptionType } from "../types";

const useStyles = createStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: theme.colors.gray[0],
    },

    videoWrapper: {
        height: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "auto",
        boxShadow: theme.shadows.xl,
    },

    unauthorizedText: {
        fontSize: 20,
        fontWeight: 500,
        color: theme.colors.red[7],
    },
}));

const Video = () => {
    const params = useParams();
    const videoId = params.id;

    const { classes } = useStyles();
    const [captions, setCaptions] = useState([] as CaptionType[]);
    const [src, setSrc] = useState("");
    const [query, setQuery] = useState("");

    const [authorized, setAuthorized] = useState(true);

    // Video controls
    const [playing, setPlaying] = useState(false);
    const [second, setSecond] = useState(0);

    // Ref to video to extract time
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // Get query from URL params
        const params = new URLSearchParams(window.location.hash.split("?")[1]);
        let q = params.get("q") || "";
        setQuery(q);

        // Fetch video from server
        axios
            .get(`video/${videoId}`)
            .then((res) => {
                // Set the image src to the object URL.
                setSrc(res.data.src);
            })
            .catch((err) => {
                if (err.response.status === 401) setAuthorized(false);
            });

        // Get captions from server
        axios
            .get(`captions/${videoId}`)
            .then((res) => {
                setCaptions(res.data.captions);
            })
            .catch((err) => {
                if (err.response.status === 401) setAuthorized(false);
            });
    }, []);

    useEffect(() => {
        // If the video is not playing, don't update the captions position
        if (!playing) {
            return;
        }

        // Otherwise, update the captions position every second
        const interval = setInterval(() => {
            updateCaptionsPosition();
        }, 200);
        return () => clearInterval(interval);
    }, [playing]);

    const updateCaptionsPosition = () => {
        if (videoRef.current) {
            // If the video exists, get the current time
            const currentTime = videoRef.current.currentTime;
            const currentSecond = Math.floor(currentTime);

            // If the current second is different from the previous one, update the state
            if (currentSecond !== second) {
                setSecond(currentSecond);
            }
        }
    };

    const setTime = (time: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            setSecond(time);
        }
    };

    return (
        <Box className={classes.root}>
            {captions && src && (
                <Grid columns={12}>
                    <Grid.Col span={8}>
                        <Box className={classes.videoWrapper}>
                            <video
                                controls
                                width="100%"
                                height="100%"
                                ref={videoRef}
                                onPlay={() => setPlaying(true)}
                                onPause={() => setPlaying(false)}
                                style={{ background: "black" }}
                            >
                                <source src={src} type="video/mp4" />
                            </video>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Captions
                            captions={captions}
                            second={second}
                            setTime={setTime}
                            query={query}
                        />
                    </Grid.Col>
                </Grid>
            )}
            {!authorized && (
                <Box className={classes.unauthorizedText}>
                    <h1>Unauthorized</h1>
                </Box>
            )}
        </Box>
    );
};

export default Video;

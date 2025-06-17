"use client";

import { createTheme } from "@mui/material";
import { Roboto_Mono } from "next/font/google";

const robotoMono = Roboto_Mono({
    subsets: ["latin", "latin-ext"]
});

export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: "#fff"
        },
    },
    typography: {
        fontFamily: robotoMono.style.fontFamily
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    input: {
                        "&:-webkit-autofill": {
                            WebkitBoxShadow: "0 0 0 100px #43386d inset",
                            WebkitTextFillColor: "#fff",
                        },
                    },
                },
            },
        },
    },
});
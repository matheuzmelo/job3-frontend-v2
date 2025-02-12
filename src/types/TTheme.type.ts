import { ThemeOptions } from "@mui/material";

export type TTheme = ThemeOptions & {
    palette: {
        primary: {
            main: string;
        };
        secondary: {
            main: string;
        };
        background: {
            paper: string;
            default: string;
        };
    };
};
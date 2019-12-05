import createMuiTheme, { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import shadows from '@material-ui/core/styles/shadows';

export const createTypography = (
    size: number,
    lineHeight: number,
    fontWeight: number,
    fontFamily = 'inherit',
    color = '#1a1a1a',
) => ({
    fontSize: size,
    lineHeight: `${lineHeight}px`,
    fontWeight,
    letterSpacing: 0,
    fontFamily,
    color,
});

// custom thme
const createTheme = (options: ThemeOptions) =>
    createMuiTheme({
        palette: {
            common: {
                black: '#1a1a1a',
            },
            primary: {
                main: '#01279c',
                light: '#0055ff',
            },
            secondary: {
                main: '#6A6A6A',
            },
            text: {
                secondary: '#4d4d4d',
            },
        },
        // override 1 and 2 levels shadows
        shadows: Object.assign(shadows, [
            'none',
            '0 8px 28px rgba(1, 50, 205, 0.08)',
            '0 20px 60px rgba(49, 69, 244, 0.1)',
        ]),
        typography: {
            h1: createTypography(22, 26, 700),
            h2: createTypography(17, 20, 700),
            h6: createTypography(12, 14, 700),
            subtitle1: createTypography(18, 22, 600, 'Roboto'),
            body1: createTypography(22, 32, 600, 'Roboto'),
            body2: createTypography(15, 22, 600, 'Roboto'),
            button: createTypography(15, 20, 600, 'Roboto'),
        },
        overrides: {
            MuiButton: {
                root: {
                    borderRadius: 0, // disable button border radius
                },
            },
        },
        ...options,
    });

export default createTheme({
    sidebar: {
        width: 300,
    },
});

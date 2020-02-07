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

const COLOR_GRAY = '#6a6a6a';
const COLOR_BLACK = '#1a1a1a';

// custom thme
const createTheme = (options: ThemeOptions) =>
    createMuiTheme({
        palette: {
            common: {
                black: COLOR_BLACK,
            },
            primary: {
                main: '#01279c',
                light: '#0132cc',
            },
            secondary: {
                main: COLOR_GRAY,
            },
            text: {
                secondary: '#4d4d4d',
            },
        },
        // override 1 and 2 levels shadows
        shadows: Object.assign(shadows, [
            'none',
            '0 2px 20px rgba(1, 50, 205, 0.08)',
            '0 20px 60px rgba(49, 69, 244, 0.1)',
        ]),
        typography: {
            h1: createTypography(22, 26, 700),
            h2: createTypography(17, 20, 700),
            h6: createTypography(12, 14, 700),
            subtitle1: createTypography(18, 22, 500, 'Roboto'),
            body1: createTypography(22, 32, 500, 'Roboto'),
            body2: createTypography(15, 22, 500, 'Roboto'),
            button: createTypography(15, 20, 500, 'Roboto'),
        },
        overrides: {
            MuiSelect: {
                root: {
                    '&:after': {
                        content: '',
                    },
                },
            },
            MuiButton: {
                root: {
                    minWidth: 114,
                    height: 48,
                    borderRadius: 0, // clear default button border radius
                    textTransform: 'inherit', // clear default uppercase
                },
                containedPrimary: {
                    backgroundColor: '#0055ff',
                },
                containedSecondary: {
                    backgroundColor: '#bdbdbd',
                },
            },
            MuiDialog: {
                paper: {
                    borderRadius: 0,
                    padding: '50px 34px 37px 34px', // override default dialog content padding
                    minWidth: 355,
                },
            },
            MuiDialogTitle: {
                root: {
                    padding: 0,
                    marginBottom: 35,
                    '& .MuiTypography-h6': {
                        ...createTypography(22, 22, 500, 'Roboto', COLOR_BLACK),
                    },
                },
            },
            MuiDialogContent: {
                root: {
                    padding: 0,
                    marginBottom: 35,
                },
            },
            MuiDialogActions: {
                root: {
                    padding: 0,
                },
            },
            MuiListItem: {
                root: {
                    paddingTop: 10, // clear default list item padding
                    paddingBottom: 10, // clear default list item padding
                    marginBottom: 0,
                    '&:last-child': {
                        marginBottom: 0,
                    },
                },
            },
            MuiListItemText: {
                primary: {
                    ...createTypography(15, 22, 500),
                    color: COLOR_GRAY,
                },
                secondary: {
                    ...createTypography(22, 32, 500),
                    color: COLOR_BLACK,
                },
                multiline: {
                    marginTop: 0,
                    marginBottom: 0,
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

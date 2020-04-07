import shadows from '@material-ui/core/styles/shadows';
import { createMuiTheme } from '@material-ui/core';
import { ThemeOptions, Theme } from '@material-ui/core/styles/createMuiTheme';

const COLOR_GRAY = '#6a6a6a';
const COLOR_BLACK = '#1a1a1a';

// custom thme
const createTheme = (options: ThemeOptions): Theme => {
  return createMuiTheme({
    overrides: {
      MuiButton: {
        containedPrimary: {
          backgroundColor: '#0055ff'
        },
        containedSecondary: {
          backgroundColor: '#bdbdbd'
        },
        root: {
          borderRadius: 0, // clear default button border radius
          height: 34,
          minWidth: 104,
          textTransform: 'inherit' // clear default uppercase
        }
      },
      MuiDialog: {
        paper: {
          borderRadius: 0,
          minWidth: 355,
          padding: 20 // override default dialog content padding
        }
      },
      MuiDialogActions: {
        root: {
          padding: 0
        }
      },
      MuiDialogContent: {
        root: {
          marginBottom: 20,
          padding: 0
        }
      },
      MuiDialogTitle: {
        root: {
          marginBottom: 20,
          padding: 0
        }
      },
      MuiInput: {
        root: {
          fontSize: 15
        }
      },
      MuiListItem: {
        root: {
          '&:first-child': {
            paddingTop: 0
          },
          '&:last-child': {
            paddingTop: 0
          },
          marginBottom: 0,
          paddingBottom: 4, // clear default list item padding
          paddingTop: 4 // clear default list item padding
        }
      },
      MuiListItemText: {
        multiline: {
          marginBottom: 0,
          marginTop: 0
        },
        primary: {
          color: COLOR_GRAY
        },
        secondary: {
          color: COLOR_BLACK
        }
      },
      MuiSelect: {
        root: {
          '&:after': {
            content: ''
          }
        }
      }
    },
    palette: {
      common: {
        black: COLOR_BLACK
      },
      primary: {
        light: '#0055ff',
        main: '#01279c'
      },
      secondary: {
        main: COLOR_GRAY
      },
      text: {
        secondary: '#4d4d4d'
      }
    },
    // override 1 and 2 levels shadows
    shadows: Object.assign(shadows, [
      'none',
      '0 2px 20px rgba(1, 50, 205, 0.08)',
      '0 20px 60px rgba(49, 69, 244, 0.1)'
    ]),
    spacing: 5,
    typography: {
      h4: {
        fontSize: 18
      }
    },
    ...options
  });
};

export default createTheme({});

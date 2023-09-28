import { createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import purple from '@material-ui/core/colors/purple';
import KenColors from './KenColors';

const primaryGreen = green[500];
const accentGreen = green.A200;
const darkGreen = green[900];
const primaryPurple = purple[500];
const accentPurple = purple.A200;
const darkPurple = purple[900];

export const overridings = {
  name: 'Dark Theme',
  palette: {
    KenColors,
    primary: {
      light: accentPurple,
      main: primaryPurple,
      dark: darkPurple,
      contrastText: '#fff',
    },
    type: 'dark',
    secondary: {
      light: accentGreen,
      main: primaryGreen,
      dark: darkGreen,
      contrastText: '#fff',
    },
    background: {
      paper: '#424242',
      default: '#303030',
    },
  },
};

export const createDarkTheme = customization => {
  const overrideTheme = {
    name: 'Dark Theme',
    palette: {
      KenColors: { ...KenColors, ...(customization?.palette || {}) },
      primary: {
        light: accentPurple,
        main: customization?.palette?.primary || KenColors.primary,
        dark: darkPurple,
        contrastText: '#fff',
      },
      type: 'dark',
      secondary: {
        light: accentGreen,
        main: primaryGreen,
        dark: darkGreen,
        contrastText: '#fff',
      },
      background: {
        paper: '#424242',
        default: '#303030',
      },
    },
    typography: {
      fontFamily: customization.fontFamily
        ? customization.fontFamily.join(',')
        : null,
    },
  };
  return createMuiTheme(overrideTheme);
};

export default createMuiTheme(overridings);

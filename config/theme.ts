/** Custom theme */
import {
  DEFAULT_THEME,
  type MantineThemeColors,
  type MantineBreakpointsValues,
} from '@mantine/core';

export const fontFamily: string = 'Poppins';
export const colors: MantineThemeColors = {
  ...DEFAULT_THEME.colors,
  primary: [
    '#A7C8E9',
    '#91BCE4',
    '#7BB1DF',
    '#64A6DA',
    '#4E99D5',
    '#478ACD',
    '#4183C6',
    '#3A7BBF',
    '#336FB8',
    '#4E88CF',
  ],
  secondary: [
    '#A7B7A0',
    '#8FA28B',
    '#7F8D76',
    '#6F795F',
    '#5F6549',
    '#4F5034',
    '#3F3B1F',
    '#2F2610',
    '#1F1000',
    '#3E513D',
  ],
  tertiary: [
    '#E6F0F1',
    '#D1E4E5',
    '#BDD7D8',
    '#A8C9CB',
    '#A0B9BD',
    '#95B0B2',
    '#8BA7A8',
    '#7F9E9D',
    '#759494',
    '#A3B5B7',
  ],
};
export const breakpoints: MantineBreakpointsValues = DEFAULT_THEME.breakpoints;

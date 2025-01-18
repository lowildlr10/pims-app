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
    '#EDF3FA',
    '#DBE7F5',
    '#C9DBF0',
    '#B8CFEB',
    '#A6C3E7',
    '#94B7E2',
    '#83ABDD',
    '#719FD8',
    '#5F93D3',
    '#4E88CF',
  ],
  secondary: [
    '#EBEDEB',
    '#D8DCD8',
    '#C5CAC4',
    '#B1B9B1',
    '#9EA89E',
    '#8B968A',
    '#778577',
    '#647363',
    '#516250',
    '#3E513D',
  ],
  tertiary: [
    '#F5F7F7',
    '#ECF0F0',
    '#E3E8E9',
    '#DAE1E2',
    '#D1DADB',
    '#C7D2D3',
    '#BECBCC',
    '#B5C3C5',
    '#ACBCBE',
    '#A3B5B7',
  ],
};
export const breakpoints: MantineBreakpointsValues = DEFAULT_THEME.breakpoints;

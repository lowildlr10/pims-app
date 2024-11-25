import '@fontsource/poppins';
import '@fontsource/poppins/100.css';
import '@fontsource/poppins/200.css';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import '@fontsource/poppins/900.css';
import '@mantine/core/styles/global.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { ColorSchemeScript, DEFAULT_THEME, MantineProvider, createTheme, mergeMantineTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { fontFamily, breakpoints, colors } from "@/config/theme";
import {
  emotionTransform,
  MantineEmotionProvider,
} from '@mantine/emotion';

const theme = mergeMantineTheme(
  DEFAULT_THEME,
  createTheme({
    fontFamily,
    breakpoints,
    colors,
  }),
);

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-background">
        <ColorSchemeScript defaultColorScheme="light" />
        <MantineProvider theme={theme} stylesTransform={emotionTransform} defaultColorScheme={'light'}>
          <MantineEmotionProvider>
            <Notifications />
            {children}
          </MantineEmotionProvider>
        </MantineProvider>
      </body>
    </html>
  )
}


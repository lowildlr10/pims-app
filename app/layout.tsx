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
import '@mantine/core/styles/baseline.css';
import '@mantine/core/styles/default-css-variables.css';
import '@mantine/core/styles/baseline.css';
import '@mantine/core/styles/default-css-variables.css';
import '@mantine/core/styles/global.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/nprogress/styles.css';

import {
  ColorSchemeScript,
  DEFAULT_THEME,
  MantineProvider,
  createTheme,
  mantineHtmlProps,
  mergeMantineTheme,
} from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { fontFamily, breakpoints, colors } from '@/config/theme';
import { emotionTransform, MantineEmotionProvider } from '@mantine/emotion';
import { getCompany } from '@/actions/company';

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const company: CompanyType = await getCompany();

  const theme = mergeMantineTheme(
    DEFAULT_THEME,
    createTheme({
      fontFamily,
      breakpoints,
      colors: {
        ...colors,
        primary: company?.theme_colors?.primary ?? colors.primary ?? undefined,
        secondary:
          company?.theme_colors?.secondary ?? colors.secondary ?? undefined,
        tertiary:
          company?.theme_colors?.tertiary ?? colors.tertiary ?? undefined,
      },
    })
  );

  return (
    <html lang='en' {...mantineHtmlProps}>
      <head>
        <link
          rel='icon'
          href={company?.favicon ?? '/favicon.ico'}
          sizes='any'
        />
        <ColorSchemeScript />
      </head>
      <body className='bg-background'>
        <MantineProvider
          theme={theme}
          stylesTransform={emotionTransform}
          defaultColorScheme={'light'}
        >
          <MantineEmotionProvider>
            <Notifications />
            {children}
          </MantineEmotionProvider>
        </MantineProvider>
      </body>
    </html>
  );
}

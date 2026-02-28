'use client';

import React from 'react';
import {
  Box,
  Card,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color?: string;
  background?: string;
  textColor?: string;
  actions?: React.ReactNode;
}

const PageHeader = ({
  title,
  subtitle,
  icon,
  color,
  background,
  textColor,
  actions,
}: PageHeaderProps) => {
  const theme = useMantineTheme();
  const lgScreenAndBelow = useMediaQuery('(max-width: 900px)');
  const isMobile = useMediaQuery('(max-width: 600px)');
  const isSmallMobile = useMediaQuery('(max-width: 400px)');

  const hasIcon =
    icon && React.isValidElement(icon) && icon.type !== React.Fragment;

  // Use custom theme colors with fallbacks
  const headerColor = color || theme.colors.primary[8];
  const headerBackground = background || headerColor;
  const headerTextColor = textColor || 'white';

  return (
    <Card
      p={
        headerBackground === 'transparent'
          ? isSmallMobile
            ? 'md'
            : isMobile
              ? 'lg'
              : lgScreenAndBelow
                ? 'lg'
                : 'xl'
          : isSmallMobile
            ? 'md'
            : isMobile
              ? 'lg'
              : lgScreenAndBelow
                ? 'lg'
                : 'xl'
      }
      radius={headerBackground === 'transparent' ? 0 : 'md'}
      bg={headerBackground}
      c={headerTextColor}
      style={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background element - only show when not transparent */}
      {headerBackground !== 'transparent' && (
        <Box
          style={{
            position: 'absolute',
            top: isSmallMobile ? '-20%' : isMobile ? '-30%' : '-50%',
            right: isSmallMobile ? '-5%' : isMobile ? '-10%' : '-20%',
            width: isSmallMobile ? '120px' : isMobile ? '150px' : '300px',
            height: isSmallMobile ? '120px' : isMobile ? '150px' : '300px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
      )}

      <Group
        align={headerBackground === 'transparent' ? 'center' : 'flex-start'}
        gap={isSmallMobile ? 'sm' : isMobile ? 'md' : 'lg'}
        style={{ position: 'relative', zIndex: 1 }}
        h={headerBackground === 'transparent' ? '100%' : 'auto'}
        justify={actions ? 'space-between' : 'flex-start'}
      >
        <Group
          align='flex-start'
          gap={isSmallMobile ? 'sm' : isMobile ? 'md' : 'lg'}
        >
          {hasIcon && (
            <ThemeIcon
              size={
                isSmallMobile ? 40 : isMobile ? 50 : lgScreenAndBelow ? 50 : 60
              }
              radius='md'
              variant={headerBackground === 'transparent' ? 'filled' : 'white'}
              color={headerBackground === 'transparent' ? 'primary.8' : 'dark'}
              style={{
                flexShrink: 0,
              }}
            >
              {icon}
            </ThemeIcon>
          )}

          <Box style={{ flex: 1, minWidth: 0 }}>
            <Title
              order={
                isSmallMobile ? 5 : isMobile ? 4 : lgScreenAndBelow ? 4 : 3
              }
              c={headerTextColor}
              fw={600}
              style={{
                lineHeight: isSmallMobile ? 1.2 : 1.3,
                wordBreak: 'break-word',
              }}
            >
              {title}
            </Title>
            {subtitle && (
              <Text
                size={
                  isSmallMobile
                    ? 'xs'
                    : isMobile
                      ? 'sm'
                      : lgScreenAndBelow
                        ? 'sm'
                        : 'md'
                }
                mt={isSmallMobile ? 2 : 4}
                c={
                  headerTextColor === 'white'
                    ? theme.colors.gray[1]
                    : theme.colors.gray[6]
                }
                style={{
                  lineHeight: isSmallMobile ? 1.3 : 1.4,
                }}
              >
                {subtitle}
              </Text>
            )}
          </Box>
        </Group>

        {actions && <Box style={{ flexShrink: 0 }}>{actions}</Box>}
      </Group>
    </Card>
  );
};

export default PageHeader;

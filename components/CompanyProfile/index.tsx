'use client';

import { colors } from '@/config/theme';
import {
  ColorPicker,
  ColorPickerProps,
  Divider,
  Group,
  InputBaseProps,
  InputProps,
  Stack,
  Text,
  TextInput,
  TextInputProps,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { useEffect, useState } from 'react';

interface CustomColorPickerClientProps {
  colorPickerProps: ColorPickerProps;
  textInputProps: TextInputProps;
}

const CustomColorPickerClient = ({
  colorPickerProps,
  textInputProps,
}: CustomColorPickerClientProps) => {
  return (
    <Stack flex={1}>
      <TextInput {...textInputProps} />
      <ColorPicker {...colorPickerProps} />
    </Stack>
  );
};

const CompanyProfileClient = () => {
  const [primary, setPrimary] = useState<string>();
  const [secondary, setSecondary] = useState<string>();
  const [tertiary, setTertiary] = useState<string>();

  const form = useForm({
    mode: 'controlled',
    initialValues: {
      theme_colors: '',
    },
  });

  useEffect(() => {
    form.setFieldValue(
      'theme_colors',
      JSON.stringify({
        primary: generateColorPalettes(primary ?? colors.primary[9]),
        secondary: generateColorPalettes(secondary ?? colors.secondary[9]),
        tertiary: generateColorPalettes(tertiary ?? colors.tertiary[9]),
      })
    );
  }, [primary, secondary, tertiary]);

  useEffect(() => {
    console.log(form.values);
  }, [form.values]);

  const generateColorPalettes = (hex: string) => {
    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.substring(1, 3), 16);
      const g = parseInt(hex.substring(3, 5), 16);
      const b = parseInt(hex.substring(5, 7), 16);
      return { r, g, b };
    };

    const rgbToHex = (r: number, g: number, b: number) => {
      return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
    };

    const { r, g, b } = hexToRgb(hex);

    return Array.from({ length: 10 }).map((_, i) => {
      const factor = 1 - (i + 1) * 0.1;
      const newR = Math.min(255, Math.floor(r + (255 - r) * factor));
      const newG = Math.min(255, Math.floor(g + (255 - g) * factor));
      const newB = Math.min(255, Math.floor(b + (255 - b) * factor));

      return rgbToHex(newR, newG, newB);
    });
  };

  return (
    <Stack>
      <Text fw={500} size={'lg'}>
        System Theme Colors
      </Text>
      <Group justify={'space-between'} w={'100%'}>
        <CustomColorPickerClient
          colorPickerProps={{
            size: 'sm',
            format: 'hex',
            swatchesPerRow: 5,
            swatches: generateColorPalettes(primary ?? colors.primary[9]),
            onChange: (value: string) => setPrimary(value),
            value: (primary ?? colors.primary[9]).toUpperCase(),
            fullWidth: true,
          }}
          textInputProps={{
            label: 'Primary Color',
            placeholder: 'Enter color value',
            value: (primary ?? colors.primary[9]).toUpperCase(),
            onChange: (event) => setPrimary(event.target.value),
            size: 'sm',
            required: true,
          }}
        />

        <CustomColorPickerClient
          colorPickerProps={{
            size: 'sm',
            format: 'hex',
            swatchesPerRow: 5,
            swatches: generateColorPalettes(secondary ?? colors.secondary[9]),
            onChange: (value: string) => setSecondary(value),
            value: (secondary ?? colors.secondary[9]).toUpperCase(),
            fullWidth: true,
          }}
          textInputProps={{
            label: 'Secondary Color',
            placeholder: 'Enter color value',
            value: (secondary ?? colors.secondary[9]).toUpperCase(),
            onChange: (event) => setSecondary(event.target.value),
            size: 'sm',
            required: true,
          }}
        />

        <CustomColorPickerClient
          colorPickerProps={{
            size: 'sm',
            format: 'hex',
            swatchesPerRow: 5,
            swatches: generateColorPalettes(tertiary ?? colors.tertiary[9]),
            onChange: (value: string) => setTertiary(value),
            value: (tertiary ?? colors.tertiary[9]).toUpperCase(),
            fullWidth: true,
          }}
          textInputProps={{
            label: 'tertiary Color',
            placeholder: 'Enter color value',
            value: (tertiary ?? colors.tertiary[9]).toUpperCase(),
            onChange: (event) => setTertiary(event.target.value),
            size: 'sm',
            required: true,
          }}
        />
      </Group>
    </Stack>
  );
};

export default CompanyProfileClient;

'use client';

import { ColorInput } from '@mantine/core';
import { ColorPicker } from '@mantine/core';
import { ColorInputProps, Stack } from '@mantine/core';
import React from 'react';

const CustomColorPickerClient = (props: ColorInputProps) => {
  return (
    <Stack flex={1}>
      <ColorInput {...props} />
      <ColorPicker
        value={props.value}
        swatches={props.swatches}
        swatchesPerRow={props.swatchesPerRow}
        withPicker={false}
        fullWidth
      />
    </Stack>
  );
};

export default CustomColorPickerClient;

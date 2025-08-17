import { LoadingOverlay, LoadingOverlayProps } from '@mantine/core';
import React from 'react';

const CustomLoadingOverlay = ({
  visible,
  zIndex = 1010,
  overlayProps = { radius: 'sm', blur: 2 },
  h = '100vh',
  pos = 'fixed',
}: LoadingOverlayProps) => {
  return (
    <LoadingOverlay
      visible={visible}
      zIndex={zIndex}
      overlayProps={overlayProps}
      h={h}
      pos={pos}
    />
  );
};

export default CustomLoadingOverlay;

'use client';

import { colors } from '@/config/theme';
import {
  ActionIcon,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconBuilding,
  IconCancel,
  IconColorPicker,
  IconPalette,
  IconPencil,
  IconPencilCog,
  IconPhoto,
} from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import SingleImageUploadClient from '../Generic/SingleImageUpload';
import API from '@/libs/API';
import { notify } from '@/libs/Notification';
import { getErrors } from '@/libs/Errors';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';
import CustomColorPickerClient from '../Generic/CustomColorPicker';
import DynamicSelect from '../Generic/DynamicSelect';
import { useMediaAsset } from '@/hooks/useMediaAsset';
import CustomLoadingOverlay from '../Generic/CustomLoadingOverlay';

const CompanyProfileClient = ({
  company,
  permissions,
}: CompanyProfileProps) => {
  const {
    media: logo,
    loading: logoLoading,
    clearCache: clearLogoCache,
  } = useMediaAsset({
    type: 'logo',
    company,
  });
  const {
    media: backgroundImage,
    loading: backgroundImageLoading,
    clearCache: clearBackgroundImageCache,
  } = useMediaAsset({
    type: 'login-background',
    company,
  });

  const [loading, setLoading] = useState(false);
  const [enableUpdate, setEnableUpdate] = useState(false);

  const [primary, setPrimary] = useState<string>(
    company.theme_colors?.primary[9] ?? colors.primary[9]
  );
  const [secondary, setSecondary] = useState<string>(
    company.theme_colors?.secondary[9] ?? colors.secondary[9]
  );
  const [tertiary, setTertiary] = useState<string>(
    company.theme_colors?.tertiary[9] ?? colors.tertiary[9]
  );

  const form = useForm({
    mode: 'controlled',
    initialValues: {
      company_name: company.company_name ?? '',
      address: company.address ?? '',
      region: company.region ?? '',
      province: company.province ?? '',
      municipality: company.municipality ?? '',
      company_type: company.company_type ?? '',
      company_head_id: company.company_head_id ?? '',
      theme_colors: JSON.stringify(company.theme_colors) ?? '',
    },
  });

  useEffect(() => {
    if (company.theme_colors?.primary)
      setPrimary(company.theme_colors?.primary[9]);

    if (company.theme_colors?.secondary)
      setSecondary(company.theme_colors?.secondary[9]);

    if (company.theme_colors?.tertiary)
      setTertiary(company.theme_colors?.tertiary[9]);
  }, [company]);

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
    form.reset();
  }, [enableUpdate]);

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

  const handleResetColorInputs = () => {
    const themeColors = JSON.parse(form.values.theme_colors);
    setPrimary(company.theme_colors?.primary[9] ?? themeColors.primary[9]);
    setSecondary(
      company.theme_colors?.secondary[9] ?? themeColors.secondary[9]
    );
    setTertiary(company.theme_colors?.tertiary[9] ?? themeColors.tertiary[9]);
  };

  const handleUpdateProfile = () => {
    setLoading(true);

    API.put('/companies', {
      ...form.values,
    })
      .then((res) => {
        notify({
          title: 'Success!',
          message: res?.message,
          color: 'green',
        });

        form.resetDirty();
        setLoading(false);
        setEnableUpdate(false);
      })
      .catch((err) => {
        const errors = getErrors(err);

        errors.forEach((error) => {
          notify({
            title: 'Failed',
            message: error,
            color: 'red',
          });
        });

        setLoading(false);
      });
  };

  return (
    <Container size='xl' py='md'>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        gap='lg'
        align='flex-start'
      >
        {/* Sidebar - Company Logo */}
        <Stack
          align='center'
          w={{ base: '100%', md: 280 }}
          style={{ flexShrink: 0 }}
        >
          <Paper
            p='xl'
            radius='md'
            w='100%'
            style={{
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.06)',
            }}
          >
            <Stack align='center' gap='md'>
              <SingleImageUploadClient
                image={logo ?? '/images/logo-black-fallback.png'}
                postUrl={'/media'}
                params={{ parent_id: company.id, type: 'logo' }}
                type={'logo'}
                clearImageCache={clearLogoCache}
              />

              <Box ta='center'>
                <Title order={4} fw={600}>
                  {company.company_name}
                </Title>
                <Title order={6} c='dimmed' fw={400}>
                  {company.company_type}
                </Title>
              </Box>
            </Stack>
          </Paper>
        </Stack>

        {/* Main Content */}
        <Box flex={1} w={{ base: '100%', md: 'auto' }}>
          <form onSubmit={form.onSubmit(() => handleUpdateProfile())}>
            <CustomLoadingOverlay
              visible={loading || logoLoading || backgroundImageLoading}
            />
            <Stack gap='lg'>
              {/* Company Details Section */}
              <Paper p='md' radius='md' withBorder>
                <Stack gap='md'>
                  <Group justify='space-between'>
                    <Group gap='xs'>
                      <IconBuilding size={20} />
                      <Title order={5}>Company Information</Title>
                    </Group>
                    {!enableUpdate &&
                      getAllowedPermissions('company', 'update')?.some(
                        (permission) => permissions.includes(permission)
                      ) && (
                        <Tooltip
                          label='Edit Company Profile'
                          withArrow
                          position='top'
                        >
                          <ActionIcon
                            color='var(--mantine-color-primary-9)'
                            radius='xl'
                            size='lg'
                            variant='filled'
                            onClick={() => setEnableUpdate(true)}
                          >
                            <IconPencilCog size={18} stroke={1.5} />
                          </ActionIcon>
                        </Tooltip>
                      )}
                  </Group>

                  <Divider />

                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='md'>
                    <TextInput
                      size='sm'
                      label='Company Name'
                      placeholder='Company Name'
                      value={form.values.company_name}
                      onChange={(event) =>
                        form.setFieldValue(
                          'company_name',
                          event.currentTarget.value
                        )
                      }
                      error={form.errors.company_name && ''}
                      readOnly={!enableUpdate}
                      required={enableUpdate}
                    />

                    <TextInput
                      size='sm'
                      label='Company Type'
                      placeholder='Company Type'
                      value={form.values.company_type}
                      onChange={(event) =>
                        form.setFieldValue(
                          'company_type',
                          event.currentTarget.value
                        )
                      }
                      error={form.errors.company_type && ''}
                      readOnly={!enableUpdate}
                    />

                    <DynamicSelect
                      endpoint={'/accounts/users'}
                      endpointParams={{ paginated: false, show_all: true }}
                      column={'fullname'}
                      label='Company Head'
                      size='sm'
                      value={form.values.company_head_id}
                      onChange={(value) =>
                        form.setFieldValue('company_head_id', value ?? '')
                      }
                      readOnly={!enableUpdate}
                    />

                    <TextInput
                      size='sm'
                      label='Municipality/City'
                      placeholder='Municipality/City'
                      value={form.values.municipality}
                      onChange={(event) =>
                        form.setFieldValue(
                          'municipality',
                          event.currentTarget.value
                        )
                      }
                      error={form.errors.municipality && ''}
                      readOnly={!enableUpdate}
                    />

                    <TextInput
                      size='sm'
                      label='Province'
                      placeholder='Province'
                      value={form.values.province}
                      onChange={(event) =>
                        form.setFieldValue(
                          'province',
                          event.currentTarget.value
                        )
                      }
                      error={form.errors.province && ''}
                      readOnly={!enableUpdate}
                    />

                    <TextInput
                      size='sm'
                      label='Region'
                      placeholder='Region'
                      value={form.values.region}
                      onChange={(event) =>
                        form.setFieldValue('region', event.currentTarget.value)
                      }
                      error={form.errors.region && ''}
                      readOnly={!enableUpdate}
                    />
                  </SimpleGrid>

                  <Textarea
                    size='sm'
                    label='Address'
                    placeholder='Address'
                    value={form.values.address}
                    onChange={(event) =>
                      form.setFieldValue('address', event.currentTarget.value)
                    }
                    error={form.errors.address && ''}
                    readOnly={!enableUpdate}
                    minRows={3}
                  />
                </Stack>
              </Paper>

              {/* Login Background Section */}
              <Paper p='md' radius='md' withBorder>
                <Stack gap='md'>
                  <Group gap='xs'>
                    <IconPhoto size={20} />
                    <Title order={5}>Login Background</Title>
                  </Group>
                  <Divider />

                  <Box
                    style={{
                      border: '1px dashed var(--mantine-color-gray-4)',
                      borderRadius: 'var(--mantine-radius-md)',
                      padding: 'var(--mantine-spacing-md)',
                    }}
                  >
                    <SingleImageUploadClient
                      image={
                        backgroundImage ?? '/images/background-fallback.png'
                      }
                      postUrl={'/media'}
                      params={{
                        parent_id: company.id,
                        type: 'login-background',
                      }}
                      height={300}
                      type={'login-background'}
                      clearImageCache={clearBackgroundImageCache}
                    />
                  </Box>
                </Stack>
              </Paper>

              {/* Theme Colors Section */}
              <Paper p='md' radius='md' withBorder>
                <Stack gap='md'>
                  <Group gap='xs'>
                    <IconPalette size={20} />
                    <Title order={5}>Theme Colors</Title>
                  </Group>
                  <Divider />

                  <SimpleGrid cols={{ base: 1, sm: 3 }} spacing='md'>
                    <CustomColorPickerClient
                      label={'Primary Color'}
                      placeholder={'Enter color value'}
                      value={(primary ?? colors.primary[9]).toUpperCase()}
                      onChange={setPrimary}
                      size={'sm'}
                      format={'hex'}
                      rightSection={<IconColorPicker size={18} stroke={1.5} />}
                      swatches={generateColorPalettes(primary)}
                      swatchesPerRow={5}
                      required={enableUpdate}
                      readOnly={!enableUpdate}
                    />

                    <CustomColorPickerClient
                      label={'Secondary Color'}
                      placeholder={'Enter color value'}
                      value={(secondary ?? colors.secondary[9]).toUpperCase()}
                      onChange={setSecondary}
                      size={'sm'}
                      format={'hex'}
                      rightSection={<IconColorPicker size={18} stroke={1.5} />}
                      swatches={generateColorPalettes(secondary)}
                      swatchesPerRow={5}
                      required={enableUpdate}
                      readOnly={!enableUpdate}
                    />

                    <CustomColorPickerClient
                      label={'Tertiary Color'}
                      placeholder={'Enter color value'}
                      value={(tertiary ?? colors.tertiary[9]).toUpperCase()}
                      onChange={setTertiary}
                      size={'sm'}
                      format={'hex'}
                      rightSection={<IconColorPicker size={18} stroke={1.5} />}
                      swatches={generateColorPalettes(tertiary)}
                      swatchesPerRow={5}
                      required={enableUpdate}
                      readOnly={!enableUpdate}
                    />
                  </SimpleGrid>
                </Stack>
              </Paper>

              {/* Action Bar */}
              {enableUpdate &&
                getAllowedPermissions('company', 'update')?.some((permission) =>
                  permissions.includes(permission)
                ) && (
                  <Paper
                    p='md'
                    radius='md'
                    style={{
                      position: 'sticky',
                      bottom: 0,
                      backgroundColor: 'var(--mantine-color-white)',
                      boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
                      zIndex: 10,
                    }}
                  >
                    <Group justify='space-between'>
                      <Text size='sm' c='dimmed'>
                        You are in edit mode
                      </Text>
                      <Group>
                        <Button
                          size='sm'
                          leftSection={<IconCancel size={16} />}
                          variant='outline'
                          color='var(--mantine-color-gray-7)'
                          onClick={() => {
                            form.reset();
                            setEnableUpdate(false);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type='submit'
                          size='sm'
                          leftSection={<IconPencil size={16} />}
                          variant='filled'
                          color='var(--mantine-color-primary-9)'
                          loading={loading}
                          loaderProps={{ type: 'dots' }}
                          autoContrast
                        >
                          Save Changes
                        </Button>
                      </Group>
                    </Group>
                  </Paper>
                )}
            </Stack>
          </form>
        </Box>
      </Flex>
    </Container>
  );
};

export default CompanyProfileClient;

'use client';

import { colors } from '@/config/theme';
import {
  Box,
  Button,
  Divider,
  Flex,
  Group,
  LoadingOverlay,
  ScrollArea,
  Stack,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconCancel,
  IconColorPicker,
  IconPencil,
  IconPencilCog,
} from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import SingleImageUploadClient from '../Generic/SingleImageUpload';
import API from '@/libs/API';
import { notify } from '@/libs/Notification';
import { getErrors } from '@/libs/Errors';
import { ActionIcon } from '@mantine/core';
import { getAllowedPermissions } from '@/utils/GenerateAllowedPermissions';
import CustomColorPickerClient from '../Generic/CustomColorPicker';
import DynamicSelect from '../Generic/DynamicSelect';

const CompanyProfileClient = ({
  company,
  permissions,
}: CompanyProfileProps) => {
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
          message: res?.data?.message,
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
    <ScrollArea
      h={{ md: '100%', lg: 'calc(100vh - 15.5em)' }}
      px={{ base: 'md', lg: 'xl' }}
      scrollbars={'y'}
    >
      <form onSubmit={form.onSubmit(() => handleUpdateProfile())}>
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        <Stack mb={'12em'} gap={'8em'}>
          <Stack>
            <Text fw={500} size={'xl'}>
              Company Details
            </Text>

            <Divider />

            <Flex
              direction={{
                base: 'column',
                lg: 'row',
              }}
              justify={{ base: 'center', lg: 'space-between' }}
              gap={'xl'}
            >
              <Stack align={'center'} p={'md'} w={{ base: '100%', lg: '25%' }}>
                <Box mb={10}>
                  <SingleImageUploadClient
                    image={
                      company.company_logo ?? '/images/logo-black-fallback.png'
                    }
                    postUrl={`/media/${company.id}`}
                    params={{ update_type: 'company-logo' }}
                    type={'logo'}
                  />
                </Box>
              </Stack>

              <Stack justify={'center'} w={{ base: '100%', lg: '75%' }}>
                <Flex
                  direction={{ base: 'column', lg: 'row' }}
                  justify={{ base: 'center', lg: 'space-between' }}
                  w={'100%'}
                  gap={{ base: 'md', lg: 'xl' }}
                >
                  <Stack flex={1}>
                    <TextInput
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
                      size={'md'}
                      readOnly={!enableUpdate}
                      required={enableUpdate}
                    />

                    <TextInput
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
                      size={'md'}
                      readOnly={!enableUpdate}
                    />

                    <DynamicSelect
                      endpoint={'/accounts/users'}
                      endpointParams={{ paginated: false, show_all: true }}
                      column={'fullname'}
                      label='Company Head'
                      size={'md'}
                      value={form.values.company_head_id}
                      onChange={(value) =>
                        form.setFieldValue('company_head_id', value)
                      }
                    />

                    <Textarea
                      label='Address'
                      placeholder='Address'
                      value={form.values.address}
                      onChange={(event) =>
                        form.setFieldValue('address', event.currentTarget.value)
                      }
                      error={form.errors.address && ''}
                      size={'md'}
                      readOnly={!enableUpdate}
                    />
                  </Stack>

                  <Stack flex={1}>
                    <TextInput
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
                      size={'md'}
                      readOnly={!enableUpdate}
                    />

                    <TextInput
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
                      size={'md'}
                      readOnly={!enableUpdate}
                    />

                    <TextInput
                      label='Region'
                      placeholder='Region'
                      value={form.values.region}
                      onChange={(event) =>
                        form.setFieldValue('region', event.currentTarget.value)
                      }
                      error={form.errors.region && ''}
                      size={'md'}
                      readOnly={!enableUpdate}
                    />
                  </Stack>
                </Flex>
              </Stack>
            </Flex>
          </Stack>

          <Stack>
            <Text fw={500} size={'xl'}>
              Login Background Image
            </Text>

            <Divider />

            <SingleImageUploadClient
              image={
                company?.login_background ?? '/images/background-fallback.png'
              }
              postUrl={`/media/${company.id}`}
              params={{ update_type: 'company-login-background' }}
              height={300}
              type={'default'}
            />
          </Stack>

          <Stack>
            <Text fw={500} size={'xl'}>
              System Theme Colors
            </Text>

            <Divider />

            <Flex
              direction={{
                base: 'column',
                lg: 'row',
              }}
              justify={'space-between'}
              gap={'xl'}
            >
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
            </Flex>
          </Stack>

          {getAllowedPermissions('company', 'update')?.some((permission) =>
            permissions.includes(permission)
          ) && (
            <Stack
              pos={'absolute'}
              bottom={5}
              right={0}
              w={{ base: '100%', lg: 'auto' }}
              px={20}
              align={'end'}
              sx={{ zIndex: 100 }}
            >
              {!enableUpdate ? (
                <Tooltip
                  arrowPosition={'center'}
                  arrowOffset={10}
                  arrowSize={4}
                  label={'Toggle Update'}
                  withArrow
                  position={'top-end'}
                >
                  <ActionIcon
                    color={'var(--mantine-color-primary-9)'}
                    radius={'100%'}
                    size={80}
                    onClick={() => setEnableUpdate(!enableUpdate)}
                  >
                    <IconPencilCog size={40} stroke={1.5} />
                  </ActionIcon>
                </Tooltip>
              ) : (
                <Group justify={'space-between'}>
                  <Button
                    type={'submit'}
                    size={'md'}
                    leftSection={<IconPencil size={18} />}
                    variant='filled'
                    color={'var(--mantine-color-primary-9)'}
                    loading={loading}
                    loaderProps={{ type: 'dots' }}
                    autoContrast
                    fullWidth
                  >
                    Update
                  </Button>
                  <Button
                    size={'md'}
                    leftSection={<IconCancel size={18} />}
                    variant='outline'
                    bg={'white'}
                    color={'var(--mantine-color-gray-8)'}
                    fullWidth
                    onClick={() => setEnableUpdate(!enableUpdate)}
                  >
                    Cancel
                  </Button>
                </Group>
              )}
            </Stack>
          )}
        </Stack>
      </form>
    </ScrollArea>
  );
};

export default CompanyProfileClient;

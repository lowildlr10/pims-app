import { ComboboxData, Loader, Select } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import API from '@/libs/API';
import { getErrors } from '@/libs/Errors';
import { notify } from '@/libs/Notification';

const DynamicSelect = ({
  name,
  defaultData,
  endpoint,
  endpointParams = {},
  column = 'column',
  valueColumn = 'id',
  size,
  label,
  placeholder,
  limit,
  value,
  defaultValue,
  variant,
  sx,
  onChange,
  readOnly,
  required,
  enableOnClickRefresh = true,
  disableFetch,
  hasPresetValue,
  isLoading,
  preLoading,
  error,
}: DynamicSelectProps) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ComboboxData | undefined>();
  const [inputValue, setInputValue] = useState<string | undefined>(value);
  const [isPresetValueSet, setIsPresetValueSet] = useState(false);
  const [presetValue, setPresetValue] = useState<string | undefined>();

  useEffect(() => {
    if (preLoading) handleFetchData();
  }, [preLoading]);

  useEffect(() => {
    if (
      defaultData === undefined ||
      (typeof defaultData === 'object' && defaultData.length === 0) ||
      (typeof defaultData === 'object' &&
        defaultData.some(
          (dat) => dat.value === undefined || dat.label === undefined
        )) ||
      typeof defaultData !== 'object'
    )
      return;
    setData(defaultData ?? []);
  }, [defaultData]);

  useEffect(() => {
    if (onChange) onChange(inputValue ?? '');
  }, [inputValue]);

  useEffect(() => {
    if (!hasPresetValue || isPresetValueSet) return;

    if (presetValue) {
      setInputValue(presetValue);
      setIsPresetValueSet(true);
    }
  }, [presetValue, hasPresetValue, isPresetValueSet]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleFetchData = () => {
    if (disableFetch || !endpoint) return;

    setLoading(true);

    API.get(endpoint, {
      ...endpointParams,
      sort_direction: 'asc',
    })
      .then((res) => {
        setData((prev) =>
          res?.data?.length > 0
            ? res.data.map((item: any) => ({
                value: item[valueColumn],
                label: item[column],
              }))
            : [{ label: 'No data.', value: '-', disabled: true }]
        );

        if (res?.data?.length > 0 && hasPresetValue && !isPresetValueSet) {
          setPresetValue(
            defaultValue
              ? (res?.data?.find(
                  (item: any) =>
                    item[valueColumn] === defaultValue ||
                    item[column].toLowerCase() === defaultValue.toLowerCase()
                )[valueColumn] ?? res?.data[0][valueColumn])
              : res?.data[0][valueColumn]
          );
        }

        setLoading(false);
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
    <Select
      name={name}
      size={size}
      label={label}
      placeholder={placeholder ?? label}
      limit={limit ?? undefined}
      comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
      data={data}
      defaultValue={!hasPresetValue ? defaultValue : undefined}
      value={inputValue ?? defaultValue}
      onChange={(_value, option) => setInputValue(option?.value ?? null)}
      nothingFoundMessage={'Nothing found...'}
      leftSection={
        (loading || isLoading) && (
          <Loader color={'var(--mantine-color-primary-9)'} size='xs' />
        )
      }
      variant={variant ?? 'default'}
      sx={sx}
      onClick={!readOnly && enableOnClickRefresh ? handleFetchData : undefined}
      searchable
      clearable
      maxDropdownHeight={limit ? undefined : 200}
      error={error}
      required={required}
      readOnly={readOnly}
    />
  );
};

export default DynamicSelect;

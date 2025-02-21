import { Loader, Select } from '@mantine/core';
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
}: DynamicSelectProps) => {
  const [loading, setLoading] = useState(disableFetch ? false : true);
  const [data, setData] = useState<{ label: string; value: string }[]>(
    defaultData ?? []
  );
  const [inputValue, setInputValue] = useState<string | undefined>(value);
  const [isPresetValueSet, setIsPresetValueSet] = useState(false);
  const [presetValue, setPresetValue] = useState<string | undefined>();

  useEffect(() => {
    if (disableFetch) return;
    handleFetchData();
  }, [disableFetch]);

  useEffect(() => {
    if (disableFetch) {
      setData(defaultData ?? []);
    }
  }, [disableFetch, defaultData]);

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
        setData(
          res?.data?.length > 0
            ? res.data.map((item: any) => ({
                value: item[valueColumn],
                label: item[column],
              }))
            : [{ label: 'No data.', value: '' }]
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
      value={inputValue}
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
      required={required}
      readOnly={readOnly}
    />
  );
};

export default DynamicSelect;

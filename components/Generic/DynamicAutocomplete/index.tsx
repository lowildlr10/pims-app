import { Autocomplete, ComboboxStringData, Loader } from '@mantine/core';
import { useDebounce } from 'use-debounce';
import React, { useEffect, useRef, useState } from 'react';
import API from '@/libs/API';
import { getErrors } from '@/libs/Errors';
import { notify } from '@/libs/Notification';

const DynamicAutocomplete = ({
  name,
  endpoint,
  endpointParams = {},
  column,
  size,
  variant,
  label,
  placeholder,
  limit,
  value,
  onChange,
  readOnly,
  required,
  sx,
}: DynamicAutocompleteProps) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ComboboxStringData | undefined>([
    {
      value: 'Loading...',
      disabled: true,
    },
  ]);
  const [inputValue, setInputValue] = useState<string | undefined>(value);
  const isExternalUpdate = useRef(false);

  const [debouncedValue] = useDebounce(inputValue, 500);

  useEffect(() => {
    if (!isExternalUpdate.current) {
      if (onChange && debouncedValue !== undefined) {
        onChange(debouncedValue ?? '');
      }
    }
    isExternalUpdate.current = false;

    handleFetchData();
  }, [debouncedValue]);

  useEffect(() => {
    isExternalUpdate.current = true;
    setInputValue(value);
  }, [value]);

  const handleFetchData = () => {
    if (!endpoint) return;

    setLoading(true);
    setData([
      {
        value: 'Loading...',
        disabled: true,
      },
    ]);

    API.get(endpoint, {
      ...endpointParams,
      search: inputValue,
      sort_direction: 'asc',
    })
      .then((res) => {
        const rawData = res?.data ?? [];
        const uniqueData = rawData.filter(
          (item: any, index: number, self: any[]) =>
            index ===
            self.findIndex(
              (t) => t[column ?? 'column'] === item[column ?? 'column']
            )
        );

        setData(
          uniqueData.length > 0
            ? uniqueData.map((item: any, index: number) => ({
                value: item[column ?? 'column'],
                key: item[column ?? 'column'] ?? index,
              }))
            : [
                {
                  value: 'No suggestion found.',
                  disabled: true,
                  key: 'no-result',
                },
              ]
        );
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

  const handleOnChange = (newValue: string) => {
    setInputValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <Autocomplete
      name={name}
      size={size}
      variant={variant ?? 'default'}
      label={label}
      placeholder={placeholder ?? label}
      data={data}
      limit={limit}
      value={inputValue}
      onChange={handleOnChange}
      comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
      maxDropdownHeight={200}
      rightSection={loading && <Loader color='blue' size='xs' />}
      readOnly={readOnly}
      required={required}
      sx={sx}
    />
  );
};

export default DynamicAutocomplete;

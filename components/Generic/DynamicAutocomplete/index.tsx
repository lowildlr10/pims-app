import { Autocomplete, ComboboxStringData, Loader } from '@mantine/core';
import { useDebounce } from 'use-debounce';
import React, { useEffect, useState } from 'react';
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

  const [debouncedValue] = useDebounce(inputValue, 500);

  useEffect(() => {
    if (onChange) onChange(debouncedValue ?? '');

    handleFetchData();
  }, [debouncedValue]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleFetchData = () => {
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
        setData(
          res?.data?.length > 0
            ? res?.data?.map((item: any) => ({
                value: item[column ?? 'column'],
              }))
            : [{ value: 'No suggestion found.', disabled: true }]
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
      onChange={(value) => setInputValue(value)}
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

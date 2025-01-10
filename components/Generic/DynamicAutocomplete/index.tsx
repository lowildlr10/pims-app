import { Autocomplete, Loader } from '@mantine/core';
import { useDebounce } from 'use-debounce';
import React, { useEffect, useState } from 'react';
import API from '@/libs/API';
import { getErrors } from '@/libs/Errors';
import { notify } from '@/libs/Notification';

const DynamicAutocomplete = ({
  endpoint,
  endpointParams = {},
  column,
  size,
  label,
  limit,
  value,
  onChange,
  readOnly,
  required,
}: DynamicAutocompleteProps) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string[]>(['Loading...']);
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
    setData(['Loading...']);

    API.get(endpoint, {
      ...endpointParams,
      search: inputValue,
      sort_direction: 'asc',
    })
      .then((res) => {
        setData(
          res?.data?.length > 0
            ? res?.data?.map((item: any) => item[column ?? 'column'])
            : ['No data.']
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
      size={size}
      label={label}
      data={data}
      limit={limit}
      value={inputValue}
      onChange={(value) => setInputValue(value)}
      comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
      maxDropdownHeight={200}
      rightSection={loading && <Loader color='blue' size='xs' />}
      readOnly={readOnly}
      required={required}
    />
  );
};

export default DynamicAutocomplete;

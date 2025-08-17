'use client';

import { Loader, MultiSelect } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import API from '@/libs/API';
import { getErrors } from '@/libs/Errors';
import { notify } from '@/libs/Notification';

const DynamicMultiselect = ({
  endpoint,
  endpointParams = {},
  column,
  size,
  variant,
  sx,
  label,
  placeholder,
  limit,
  value,
  onChange,
  readOnly,
  required,
}: DynamicMultiselectProps) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ label: string; value: string }[]>([]);
  const [inputValue, setInputValue] = useState<string[] | undefined>(value);

  useEffect(() => handleFetchData(), []);

  useEffect(() => {
    if (onChange) onChange(inputValue ?? []);
  }, [inputValue]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleFetchData = () => {
    setLoading(true);

    API.get(endpoint, {
      ...endpointParams,
      sort_direction: 'asc',
    })
      .then((res) => {
        setData(
          res?.data?.length > 0
            ? res.data.map((item: any) => ({
                value: item.id,
                label: item[column ?? 'column'],
              }))
            : [{ label: 'No data.', value: '' }]
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
    <MultiSelect
      variant={variant}
      size={size}
      label={label}
      placeholder={placeholder}
      limit={limit ?? undefined}
      comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
      data={data}
      value={inputValue}
      onChange={(value) => setInputValue(value ?? null)}
      onFocus={() => handleFetchData()}
      nothingFoundMessage={'Nothing found...'}
      leftSection={
        loading && <Loader color={'var(--mantine-color-primary-9)'} size='xs' />
      }
      searchable
      clearable
      sx={sx}
      maxDropdownHeight={limit ? undefined : 200}
      required={required}
      readOnly={readOnly}
    />
  );
};

export default DynamicMultiselect;

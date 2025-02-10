import { Loader, Select } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import API from '@/libs/API';
import { getErrors } from '@/libs/Errors';
import { notify } from '@/libs/Notification';

const DynamicSelect = ({
  name,
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
  onChange,
  readOnly,
  required,
}: DynamicSelectProps) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ label: string; value: string }[]>([]);
  const [inputValue, setInputValue] = useState<string | undefined>(value);

  useEffect(() => handleFetchData(), []);

  useEffect(() => {
    if (onChange) onChange(inputValue ?? '');
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
                value: item[valueColumn],
                label: item[column],
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
    <Select
      name={name}
      size={size}
      label={label}
      placeholder={placeholder ?? label}
      limit={limit ?? undefined}
      comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
      data={data}
      defaultValue={defaultValue}
      value={inputValue}
      onChange={(_value, option) => setInputValue(option?.value ?? null)}
      nothingFoundMessage={'Nothing found...'}
      leftSection={
        loading && <Loader color={'var(--mantine-color-primary-9)'} size='xs' />
      }
      variant={variant ?? 'default'}
      onClick={!readOnly ? handleFetchData : undefined}
      searchable
      clearable
      maxDropdownHeight={limit ? undefined : 200}
      required={required}
      readOnly={readOnly}
    />
  );
};

export default DynamicSelect;

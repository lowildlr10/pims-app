'use client';

import { Loader, MultiSelect } from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react';
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
  const isExternalUpdate = useRef(false);

  useEffect(() => {
    handleFetchData();
  }, []);

  useEffect(() => {
    if (isExternalUpdate.current) {
      isExternalUpdate.current = false;
      return;
    }

    if (onChange && inputValue !== undefined) {
      onChange(inputValue ?? []);
    }
  }, [inputValue]);

  useEffect(() => {
    isExternalUpdate.current = true;
    setInputValue(value);
  }, [value]);

  const handleFetchData = () => {
    if (!endpoint) return;

    setLoading(true);

    API.get(endpoint, {
      ...endpointParams,
      sort_direction: 'asc',
    })
      .then((res) => {
        const rawData = res?.data ?? [];
        const uniqueData = rawData.filter(
          (item: any, index: number, self: any[]) =>
            index === self.findIndex((t) => t.id === item.id)
        );

        setData(
          uniqueData.length > 0
            ? uniqueData.map((item: any) => ({
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

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Select, Loader } from '@mantine/core';
import API from '@/libs/API';
import { getErrors } from '@/libs/Errors';
import { notify } from '@/libs/Notification';
import Helper from '@/utils/Helpers';

const DynamicSelect: React.FC<DynamicSelectProps> = ({
  name,
  defaultData = [],
  endpoint,
  endpointParams = {},
  valueColumn = 'id',
  column = 'column',
  label,
  placeholder,
  size,
  value,
  defaultValue = null,
  limit,
  variant = 'default',
  sx,
  readOnly,
  required,
  enableOnClickRefresh = true,
  disableFetch,
  hasPresetValue,
  isLoading,
  preLoading,
  error,
  onChange,
}) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue);
  const [data, setData] = useState<DynamicSelectComboboxDataType>(defaultData);
  const [presetValueApplied, setPresetValueApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialPreloading, setInitialPreloading] = useState(preLoading);
  const effectiveValue = isControlled ? value : internalValue;

  const fetchData = useCallback(async () => {
    if (disableFetch || !endpoint) return;
    setLoading(true);
    try {
      const res = await API.get(endpoint, { ...endpointParams, sort_direction: 'asc' });
      const items = res?.data ?? [];

      if (items.length > 0) {
        const mappedData = items.map((item: any) => ({
          value: item[valueColumn],
          label: item[column],
        }));

        setData(mappedData);

        if (hasPresetValue && !presetValueApplied) {
          const valueToCompare = !isControlled ? defaultValue : value;
          const presetItem = valueToCompare
            ? items.find(
              (item: any) =>
                item[valueColumn] === valueToCompare ||
                item[column]?.toLowerCase() === (valueToCompare as string).toLowerCase()
            )
            : null;

          const presetVal = presetItem?.[valueColumn] ?? items[0][valueColumn];

          if (!isControlled) {
            setInternalValue(presetVal);
          } else {
            onChange?.(presetVal);
          }

          setPresetValueApplied(true);
        }
      } else {
        setData([]);
      }
    } catch (err) {
      getErrors(err).forEach((msg) =>
        notify({ title: 'Failed', message: msg, color: 'red' })
      );
    } finally {
      setLoading(false);
    }
  }, [
    disableFetch,
    endpoint,
    endpointParams,
    valueColumn,
    column,
    defaultValue,
    hasPresetValue,
    isControlled,
    internalValue
  ]);

  useEffect(() => {
    if (preLoading && initialPreloading) {
      fetchData();
      setInitialPreloading(false);
    }
  }, [fetchData, preLoading, initialPreloading]);

  useEffect(() => {
    if (defaultData.length) {
      setData(defaultData);
    }
  }, [defaultData]);

  useEffect(() => {
    if (!isControlled) {
      setInternalValue(defaultValue);
    }
  }, [defaultValue, isControlled]);

  const handleChange = (val: string | null) => {
    if (!isControlled) {
      setInternalValue(val);
    }

    onChange?.(val);
  };

  useEffect(() => {
    if (!isControlled) return;

    onChange?.(effectiveValue);

    if (effectiveValue) {
      fetchData();
    }
  }, [effectiveValue, isControlled]);

  return (
    <Select
      name={name}
      size={size}
      label={label}
      placeholder={placeholder ?? label}
      limit={limit}
      data={data}
      comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
      value={effectiveValue}
      defaultValue={!isControlled ? defaultValue : undefined}
      onChange={(_, option) => handleChange(option?.value ?? null)}
      nothingFoundMessage="Nothing found..."
      leftSection={(loading || isLoading) && <Loader size="xs" color="var(--mantine-color-primary-9)" />}
      variant={variant}
      sx={sx}
      onClick={!readOnly && enableOnClickRefresh ? fetchData : undefined}
      searchable
      clearable
      maxDropdownHeight={limit ? undefined : 200}
      required={required}
      readOnly={readOnly}
      error={error}
    />
  );
};

export default DynamicSelect;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Select, Loader } from '@mantine/core';
import API from '@/libs/API';
import { getErrors } from '@/libs/Errors';
import { notify } from '@/libs/Notification';

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
  const [internalValue, setInternalValue] = useState<string | null>(
    defaultValue
  );
  const [data, setData] = useState<DynamicSelectComboboxDataType>(defaultData);
  const [presetValueApplied, setPresetValueApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialPreloading, setInitialPreloading] = useState(preLoading);
  const effectiveValue = isControlled ? value : internalValue;
  const prevValueRef = useRef<string | null>(effectiveValue);
  const isFirstRender = useRef(true);

  // Use refs for values that change frequently but shouldn't recreate fetchData
  const endpointParamsRef = useRef(endpointParams);
  endpointParamsRef.current = endpointParams;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const valueRef = useRef(value);
  valueRef.current = value;

  const fetchData = useCallback(async () => {
    if (disableFetch || !endpoint) return;
    setLoading(true);
    try {
      const res = await API.get(endpoint, {
        ...endpointParamsRef.current,
        sort_direction: 'asc',
      });
      const items = res?.data ?? [];

      if (items.length > 0) {
        const mappedData = items.map((item: any) => ({
          value: item[valueColumn],
          label: item[column],
        }));

        const mergedData =
          defaultData.length > 0
            ? [
                ...defaultData,
                ...mappedData.filter(
                  (md: DynamicSelectComboboxDataType[number]) =>
                    !defaultData.some(
                      (dd: DynamicSelectComboboxDataType[number]) =>
                        dd.value === md.value
                    )
                ),
              ]
            : mappedData;
        setData(mergedData);

        if (hasPresetValue && !presetValueApplied) {
          const valueToCompare = !isControlled
            ? defaultValue
            : valueRef.current;
          const presetItem = valueToCompare
            ? items.find(
                (item: any) =>
                  item[valueColumn] === valueToCompare ||
                  item[column]?.toLowerCase() ===
                    (valueToCompare as string).toLowerCase()
              )
            : null;

          const presetVal = presetItem?.[valueColumn] ?? items[0][valueColumn];

          if (!isControlled) {
            setInternalValue(presetVal);
          } else if (isFirstRender.current) {
            onChangeRef.current?.(presetVal);
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
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [
    disableFetch,
    endpoint,
    valueColumn,
    column,
    defaultValue,
    hasPresetValue,
    isControlled,
    presetValueApplied,
  ]);

  useEffect(() => {
    if (preLoading && initialPreloading) {
      fetchData();
      setInitialPreloading(false);
    }
  }, [fetchData, preLoading, initialPreloading]);

  useEffect(() => {
    if (defaultData.length > 0) {
      setData((prevData) => {
        const existingValues = new Set(prevData.map((item) => item.value));
        const merged = prevData.slice();
        defaultData.forEach((item: DynamicSelectComboboxDataType[number]) => {
          if (!existingValues.has(item.value)) {
            merged.push(item);
          }
        });
        return merged;
      });
    }
  }, [defaultData]);

  useEffect(() => {
    if (!effectiveValue) return;
    if (
      data.some(
        (item: DynamicSelectComboboxDataType[number]) =>
          item.value === effectiveValue
      )
    )
      return;
    if (
      defaultData.some(
        (item: DynamicSelectComboboxDataType[number]) =>
          item.value === effectiveValue
      )
    )
      return;
    setData((prev) => [
      ...prev,
      { value: effectiveValue, label: effectiveValue },
    ]);
  }, [effectiveValue]);

  useEffect(() => {
    if (!isControlled) {
      setInternalValue(defaultValue);
    }
  }, [defaultValue, isControlled]);

  const handleChange = (val: string | null) => {
    if (!isControlled) {
      setInternalValue(val);
    }

    if (val !== prevValueRef.current) {
      prevValueRef.current = val;
      onChangeRef.current?.(val);
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!isControlled) return;

    if (effectiveValue && !isLoading) {
      fetchData();
    }
  }, [effectiveValue, isControlled, isLoading, fetchData]);

  return (
    <Select
      name={name}
      size={size}
      label={label}
      placeholder={placeholder ?? label}
      limit={limit}
      data={data.filter(
        (item, index, self) =>
          self.findIndex((t) => t.value === item.value) === index
      )}
      comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
      value={effectiveValue}
      defaultValue={!isControlled ? defaultValue : undefined}
      onChange={(_, option) => handleChange(option?.value ?? null)}
      nothingFoundMessage='Nothing found...'
      leftSection={
        (loading || isLoading) && (
          <Loader size='xs' color='var(--mantine-color-primary-9)' />
        )
      }
      variant={variant}
      sx={sx}
      onFocus={!readOnly && enableOnClickRefresh ? fetchData : undefined}
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

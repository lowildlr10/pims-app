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
  const [loading, setLoading] = useState(false);

  const effectiveValue = isControlled ? value : internalValue;

  // Stable refs to avoid stale closures without recreating callbacks
  const endpointParamsRef = useRef(endpointParams);
  endpointParamsRef.current = endpointParams;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const defaultDataRef = useRef(defaultData);
  defaultDataRef.current = defaultData;
  const effectiveValueRef = useRef(effectiveValue);
  effectiveValueRef.current = effectiveValue;

  // Use a ref instead of state so preset logic never causes fetchData to recreate
  const presetAppliedRef = useRef(false);
  // Track previous effectiveValue to avoid triggering cascading fetch on mount
  const prevEffectiveValueRef = useRef<string | null | undefined>(undefined);

  const fetchData = useCallback(async () => {
    if (disableFetch || !endpoint) return;
    setLoading(true);
    try {
      const res = await API.get(endpoint, {
        ...endpointParamsRef.current,
        sort_direction: 'asc',
      });
      const items: any[] = res?.data ?? [];

      if (items.length > 0) {
        const mappedData = items.map((item) => ({
          value: String(item[valueColumn]),
          label: item[column],
        }));

        const currentDefaultData = defaultDataRef.current;
        const mergedData =
          currentDefaultData.length > 0
            ? [
                ...currentDefaultData,
                ...mappedData.filter(
                  (md) =>
                    !currentDefaultData.some(
                      (dd: DynamicSelectComboboxDataType[number]) =>
                        dd.value === md.value
                    )
                ),
              ]
            : mappedData;

        setData(mergedData);

        if (hasPresetValue && !presetAppliedRef.current) {
          const valueToCompare = isControlled
            ? effectiveValueRef.current
            : defaultValue;
          const presetItem = valueToCompare
            ? items.find(
                (item) =>
                  String(item[valueColumn]) === String(valueToCompare) ||
                  item[column]?.toLowerCase() ===
                    (valueToCompare as string).toLowerCase()
              )
            : null;

          const presetVal = String(
            presetItem ? presetItem[valueColumn] : items[0][valueColumn]
          );

          if (!isControlled) {
            setInternalValue(presetVal);
          } else {
            onChangeRef.current?.(presetVal);
          }

          presetAppliedRef.current = true;
        }
      } else {
        setData(
          defaultDataRef.current.length > 0 ? defaultDataRef.current : []
        );
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
    valueColumn,
    column,
    hasPresetValue,
    isControlled,
    defaultValue,
  ]);

  // Initial preload
  useEffect(() => {
    if (preLoading) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cascading fetch: re-fetch when effectiveValue changes in controlled mode,
  // but only after the initial mount (skip the very first render)
  useEffect(() => {
    if (prevEffectiveValueRef.current === undefined) {
      prevEffectiveValueRef.current = effectiveValue;
      return;
    }
    if (prevEffectiveValueRef.current === effectiveValue) return;
    prevEffectiveValueRef.current = effectiveValue;

    if (isControlled && effectiveValue && !isLoading) {
      fetchData();
    }
  }, [effectiveValue, isControlled, isLoading, fetchData]);

  // Sync defaultData changes into data state
  useEffect(() => {
    if (defaultData.length === 0) return;
    setData((prevData) => {
      const defaultMap = new Map<string, DynamicSelectComboboxDataType[number]>(
        (defaultData as DynamicSelectComboboxDataType).map((item) => [
          item.value,
          item,
        ])
      );
      const merged = prevData.map(
        (item: DynamicSelectComboboxDataType[number]) => {
          const defaultItem = defaultMap.get(item.value);
          return defaultItem?.label
            ? { ...item, label: defaultItem.label }
            : item;
        }
      );
      const existingValues = new Set(prevData.map((item) => item.value));
      (defaultData as DynamicSelectComboboxDataType).forEach((item) => {
        if (!existingValues.has(item.value)) merged.push(item);
      });
      return merged;
    });
  }, [defaultData]);

  // Ensure effectiveValue has a corresponding option (fallback label = value)
  useEffect(() => {
    if (!effectiveValue) return;
    setData((prev) => {
      if (prev.some((item) => item.value === effectiveValue)) return prev;
      if (
        (defaultDataRef.current as DynamicSelectComboboxDataType).some(
          (item) => item.value === effectiveValue
        )
      )
        return prev;
      return [...prev, { value: effectiveValue, label: effectiveValue }];
    });
  }, [effectiveValue]);

  // Sync defaultValue into internal state for uncontrolled mode
  useEffect(() => {
    if (!isControlled) setInternalValue(defaultValue);
  }, [defaultValue, isControlled]);

  const handleChange = (val: string | null) => {
    if (!isControlled) setInternalValue(val);
    onChangeRef.current?.(val);
  };

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
      value={effectiveValue ?? null}
      onChange={handleChange}
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

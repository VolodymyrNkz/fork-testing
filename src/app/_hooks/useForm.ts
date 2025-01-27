import { useState, useCallback, useEffect } from 'react';

type Validator = (value: string) => boolean;
type FieldConfig = {
  value: string;
  validator?: Validator;
  touched: boolean;
};

type FormState<T extends Record<string, string>> = {
  [K in keyof T]: FieldConfig;
};

export interface UseFormReturn<T extends Record<string, string>> {
  formValues: T;
  updateField: (field: keyof T, value: string | undefined) => void;
  setValidator: (field: keyof T, validator: Validator) => void;
  isFieldValid: (field: keyof T) => boolean;
  removeField: (field: keyof T) => void;
  isAllFieldsValid: () => boolean;
  getInvalidFields: () => (keyof T)[];
  touchAllFields: () => void;
  formState: FormState<T>;
}

export const useForm = <T extends Record<string, string>>(
  initialState: T,
  storageKey?: string,
): UseFormReturn<T> & { removeField: (field: keyof T) => void } => {
  let storedValues: any;
  const getInitialFormValues = (): FormState<T> => {
    if (typeof window !== 'undefined') {
      storedValues = storageKey ? window.sessionStorage?.getItem(storageKey) : null;
    }

    if (storedValues) {
      try {
        const parsedValues = JSON.parse(storedValues) as FormState<T>;
        return Object.keys(initialState).reduce(
          (acc, key) => ({
            ...acc,
            [key]: parsedValues[key as keyof T] || {
              value: initialState[key as keyof T] || '',
              validator: undefined,
              touched: false,
            },
          }),
          {} as FormState<T>,
        );
      } catch {
        return Object.keys(initialState).reduce(
          (acc, key) => ({
            ...acc,
            [key]: {
              value: initialState[key as keyof T] || '',
              validator: undefined,
              touched: false,
            },
          }),
          {} as FormState<T>,
        );
      }
    }
    return Object.keys(initialState).reduce(
      (acc, key) => ({
        ...acc,
        [key]: { value: initialState[key as keyof T] || '', validator: undefined, touched: false },
      }),
      {} as FormState<T>,
    );
  };

  const [formValues, setFormValues] = useState<FormState<T>>(getInitialFormValues);

  const saveToSessionStorage = (updatedValues: FormState<T>) => {
    if (!storageKey) {
      return;
    }

    const existingData = sessionStorage.getItem(storageKey);
    const parsedData = existingData ? JSON.parse(existingData) : {};
    const newData = { ...parsedData, ...updatedValues };
    sessionStorage.setItem(storageKey, JSON.stringify(newData));
  };

  const updateField = (field: keyof T, value: string | undefined) => {
    setFormValues((prev) => {
      const updated = {
        ...prev,
        [field]: { ...prev[field], value: value || '', touched: true },
      };
      saveToSessionStorage({ [field]: updated[field] } as any);
      return updated;
    });
  };

  const setValidator = useCallback((field: keyof T, validator: Validator) => {
    setFormValues((prev) => {
      const updated = {
        ...prev,
        [field]: { ...prev[field], validator },
      };
      saveToSessionStorage({ [field]: updated[field] } as any);
      return updated;
    });
  }, []);

  const isFieldValid = (field: keyof T) => {
    const fieldState = formValues[field];
    return fieldState?.validator ? fieldState?.validator(fieldState.value) : true;
  };

  const isAllFieldsValid = useCallback(() => {
    return Object.keys(formValues).every((key) => isFieldValid(key as keyof T));
  }, [formValues]);

  const getInvalidFields = () => {
    return Object.keys(formValues).filter((key) => !isFieldValid(key as keyof T));
  };

  const touchAllFields = useCallback(() => {
    setFormValues((prev) => {
      const updated = Object.keys(prev).reduce((acc, key) => {
        acc[key as keyof T] = { ...prev[key as keyof T], touched: true };
        return acc;
      }, {} as FormState<T>);
      saveToSessionStorage(updated);
      return updated;
    });
  }, []);

  const removeField = (field: keyof T) => {
    setFormValues((prev) => {
      const updated = Object.fromEntries(
        Object.entries(prev).filter(([key]) => key !== field),
      ) as FormState<T>;
      saveToSessionStorage(updated);
      return updated;
    });
  };

  useEffect(() => {
    saveToSessionStorage(formValues);
  }, [formValues]);

  return {
    formValues: Object.keys(formValues).reduce((acc, key) => {
      acc[key as keyof T] = formValues[key as keyof T].value as T[keyof T];
      return acc;
    }, {} as T),
    updateField,
    setValidator,
    isFieldValid,
    isAllFieldsValid,
    getInvalidFields,
    touchAllFields,
    formState: formValues,
    removeField,
  };
};

export const VALIDATORS = {
  required: (value: string) => value?.trim().length > 0,
  email: (value: string) => /\S+@\S+\.\S+/.test(value),
  phone: (value: string) => /^[0-9]{4,10}$/.test(value),
  date: (value: string) => {
    if (!value) return false;

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(value)) return false;

    const date = new Date(value);
    if (isNaN(date.getTime())) return false;

    const now = new Date();
    return date <= now;
  },
  dateFuture: (value: string): boolean => {
    const today = new Date();
    const inputDate = new Date(value);

    if (isNaN(inputDate.getTime())) return false;

    if (inputDate <= today) {
      return false;
    }

    return inputDate > today;
  },
  zipCode: (value: string): boolean => {
    if (!value) return false;

    const usZipCodePattern = /^\d{5}(-\d{4})?$/;

    const internationalZipCodePattern = /^[A-Za-z0-9\- ]{3,10}$/;

    return usZipCodePattern.test(value) || internationalZipCodePattern.test(value);
  },
};

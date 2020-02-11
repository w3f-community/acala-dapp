import React, { FC, useState, ChangeEventHandler, PropsWithChildren, useEffect } from 'react';
import { TextField, TextFieldProps } from '@material-ui/core';

type Props = Omit<TextFieldProps, 'onChange' | 'error'> & {
    defaultValue?: number;
    max?: number;
    min?: number;
    error?: string | boolean | undefined;
    onChange?: (value: number) => any;
    onError?: () => any;
};

export const NumberInput: FC<Props> = ({ defaultValue, max, min, error, onError, onChange, ...originProps }) => {
    const [value, setValue] = useState<string>('');
    const [_error, setError] = useState<boolean>(false);
    const regex = /^([1-9]\d*|0)(\.\d+)?$/;

    const inputHandler: ChangeEventHandler<HTMLInputElement> = e => {
        setValue(e.target.value);
    };
    const handleBound = (value: number): void => {
        if (max && value > max) {
            setValue(String(max));
        }
        if (min && value < min) {
            setValue(String(min));
        }
    };

    useEffect(() => {
        setError(!!error);
    }, [error]);

    useEffect(() => {
        if (regex.test(value)) {
            handleBound(Number(value));
        }
    }, [value]);

    useEffect(() => {
        if (!value || regex.test(value)) {
            // dispatch to upper component
            onChange && onChange(Number(value));
            setError(false);
        } else {
            // show error
            onError && onError();
            setError(true);
        }
    }, [value]);

    useEffect(() => {
        setValue(String(defaultValue || ''));
    }, [defaultValue]);

    return (
        <TextField
            {...originProps}
            variant="standard"
            type="text"
            value={value}
            error={_error}
            onChange={inputHandler}
        />
    );
};

import React, { FC, useState, ChangeEventHandler, useEffect } from 'react';
import { TextField, TextFieldProps } from '@material-ui/core';

type Props = Omit<TextFieldProps, 'onChange' | 'error' | 'onError'> & {
    defaultValue?: number;
    max?: number;
    min?: number;
    error?: string | undefined;
    onChange?: (value: number) => any;
    onError?: (msg: string) => any;
};

export const NumberInput: FC<Props> = ({
    defaultValue,
    max,
    min,
    error,
    onError,
    onChange,
    helperText,
    ...originProps
}) => {
    const [value, setValue] = useState<string>('');
    const [innerError, setInnerError] = useState<string>('');
    const regex = /^\-?([1-9]\d*|0)(\.\d{1,6})?$/;

    const inputHandler: ChangeEventHandler<HTMLInputElement> = e => {
        setValue(e.target.value);
    };

    const checkBound = (value: number): boolean => {
        if (typeof max === 'number' && value > max) {
            const error = `The input is larger than ${max}`;
            setInnerError(error);
            onError && onError(error);
            return false;
        }
        if (typeof min === 'number' && value < min) {
            const error = `The input is smaller than ${min}`;
            setInnerError(error);
            onError && onError(error);
            return false;
        }
        return true;
    };

    useEffect(() => {
        if (regex.test(value)) {
            checkBound(Number(value));
        }
    }, [value]);

    useEffect(() => {
        if (value && !regex.test(value)) {
            setInnerError('The input is not a valid number');
            return;
        }
        if (!checkBound(Number(value))) {
            return;
        }
        // dispatch to upper component
        onChange && onChange(Number(value));
        setInnerError('');
    }, [value]);

    useEffect(() => {
        setValue(String(defaultValue || ''));
    }, [defaultValue]);

    return (
        <TextField
            {...originProps}
            variant="standard"
            type="number"
            value={value}
            error={!!innerError || !!error}
            helperText={innerError || error || helperText}
            onChange={inputHandler}
        />
    );
};

import * as React from "react";
import styled from "styled-components";
import { safeParseInt } from "../util";

export interface IntegerInputProps {
    value?: number;

    min?: number;
    max?: number;
    placeholder?: string;

    onChange?(value: number): void;
}

const Input = styled.input`
    width: 64px;
`;

export default function IntegerInput(props: IntegerInputProps) {
    const [raw, setRaw] = React.useState<string | null>();

    return (
        <Input
            type="number"
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            value={raw ?? props.value ?? props.placeholder}
        />
    );

    function onFocus(e: React.FormEvent) {
        if (props.value == null) return;
        setRaw(props.value.toString());
    }

    function onChange(e: React.FormEvent<HTMLInputElement>) {
        setRaw(e.currentTarget.value);
    }

    function onBlur() {
        if (raw == null) return;
        const v = safeParseInt(raw);

        if (v == null) return;
        if (props.max != null && props.max < v) return;
        if (props.min != null && props.min > v) return;

        props.onChange?.(v);
        setRaw(null);
    }
}

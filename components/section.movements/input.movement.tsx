'use client';

import { FormatCurrency } from "@/helpers/format.currency";
import { useState } from "react";

type InputMovementProps = {
    value: number;
    updateAmount: (e: any) => any;
};

const InputMovement = (props: InputMovementProps) => {
    const [rawValue, setRawValue] = useState<number>(props.value); // Raw numeric value
    const [displayValue, setDisplayValue] = useState<string>(FormatCurrency(props.value, 'COP')); // Formatted value for display

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;

        // Remove non-numeric characters (e.g., currency symbols, commas)
        const rawNumber = parseInt(input.replace(/[^0-9]/g, ''), 10);

        if (!isNaN(rawNumber)) {
            props.updateAmount(rawNumber); // Update parent component
            setRawValue(rawNumber); // Update raw value
            setDisplayValue(input); // Temporarily show user input
        } else {
            setRawValue(0); // Reset raw value if input is invalid
            setDisplayValue(''); // Clear input display
        }
    };

    const handleBlur = () => {
        // Format value when the user leaves the field
        setDisplayValue(FormatCurrency(rawValue, 'COP'));
    };

    return (
        <input
            type="text"
            className="input-reset font-bold"
            value={displayValue}
            onChange={handleChange}
            onBlur={handleBlur}
        />
    );
};

export default InputMovement;
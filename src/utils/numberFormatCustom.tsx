import React from 'react';
import { NumericFormat, NumberFormatValues } from 'react-number-format';

interface NumberFormatCustomProps {
  inputRef: (instance: HTMLInputElement | null) => void;
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumberFormatCustom = React.forwardRef<HTMLInputElement, NumberFormatCustomProps>(
  (props, ref) => {
    const { inputRef, onChange, name, ...other } = props;
    return (
      <NumericFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={(values: NumberFormatValues) => {
          onChange({
            target: {
              name,
              value: values.value,
            },
          });
        }}
        thousandSeparator=","
        valueIsNumericString={true}
      />
    );
  }
);

NumberFormatCustom.displayName = 'NumberFormatCustom';

export default NumberFormatCustom;

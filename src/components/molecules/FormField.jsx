import React from "react";
import { FieldError, FieldInput, FieldLabel } from "../atoms";

export function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  error,
  options = [],
  className = "",
  readOnly = false,
  step,
  rows,
}) {
  return (
    <div className={`mb-6 ${className}`}>
      <FieldLabel
        label={label}
        name={name}
        required={required}
        hasError={!!error}
      />
      <FieldInput
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
        error={!!error}
        options={options}
        step={step}
        rows={rows}
      />
      <FieldError error={error} />
    </div>
  );
}

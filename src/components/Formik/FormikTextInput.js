import React, { useEffect } from "react";
import { useField } from "formik";
import TextField from "@mui/material/TextField";

const FormikTextInput = ({
  name,
  type,
  placeholder,
  marginBottom,
  containerStyle,
  ...props
}) => {
  const [field, meta, helpers] = useField(name); // useField has to be under Formik component to work
  const showError = meta.touched && meta.error;

  return (
    <div style={containerStyle}>
      <TextField
        type={type ? type : "text"}
        variant="outlined"
        label={placeholder}
        placeholder={placeholder}
        onChange={(event) => helpers.setValue(event.target.value)}
        onBlur={() => helpers.setTouched(true)}
        value={field.value}
        error={Boolean(showError)}
        {...props}
      />

      <p className={showError ? "text-red-600" : "opacity-0 "}>
        {meta.error || "error placeholder"}
      </p>
    </div>
  );
};

export default FormikTextInput;

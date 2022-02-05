import React, { useEffect } from "react";
import { useField } from "formik";
import TextField from "@mui/material/TextField";

const FormikTextInput = ({ name, type, placeholder, ...props }) => {
  const [field, meta, helpers] = useField(name); // useField has to be under Formik component to work
  const showError = meta.touched && meta.error;

  return (
    <div>
      <TextField
        type={type ? type : "text"}
        variant="outlined"
        label={placeholder}
        placeholder={placeholder}
        onChange={(event) => helpers.setValue(event.target.value)}
        onBlur={() => helpers.setTouched(true)}
        value={field.value}
        error={meta.touched && meta.error}
        {...props}
      />

      {showError && <p className="text-red-600">{meta.error}</p>}
    </div>
  );
};

export default FormikTextInput;

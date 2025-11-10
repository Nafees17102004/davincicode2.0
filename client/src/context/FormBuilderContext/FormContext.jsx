import { createContext, useContext, useReducer } from "react";
import { formReducer, initialState } from "./formReducer";

const FormDataContext = createContext(null);

export function FormDataProvider({ children }) {
  const [state, dispatch] = useReducer(formReducer, initialState);
  return (
    <FormDataContext value={{ state, dispatch }}>{children}</FormDataContext>
  );
}

export function useFormData() {
  return useContext(FormDataContext);
}

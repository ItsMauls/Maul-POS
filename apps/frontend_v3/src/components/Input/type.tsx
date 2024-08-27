// types.ts
import { FieldError } from 'react-hook-form';

export interface InputFieldProps {
  label?: string;
  name?: string;
  register?: any;
  placeholder?: string;
  error?: FieldError | any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  readOnly?: boolean;
  suffix?: string | any;
  type?: string
  className?: string;
  labelPosition?: 'top' | 'left';
  as?: 'input' | 'textarea';
  value?: string | number;
  props?: any;
  step?: string;
  disabled?: boolean;
}

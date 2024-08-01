// types.ts
import { FieldError } from 'react-hook-form';

export interface InputFieldProps {
  label: string;
  name: string;
  register: any;
  error?: FieldError;
  readOnly?: boolean;
  suffix?: string;
  type?: string
  labelPosition?: 'top' | 'left';
}

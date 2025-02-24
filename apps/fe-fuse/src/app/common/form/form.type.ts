export interface TextInput {
  label: string;
  name: string;
  required: boolean;
  pattern: string;
  placeholder: string;
  value: string;
}

export interface NumberInput {
  label: string;
  name: number;
  required: boolean;
  pattern: string;
  placeholder: string;
  value: string;
}

export interface SelectInput {
  label: string;
  name: string;
  required: boolean;
  options: { value: any; title: string }[];
  value: any;
}

export interface DateInput {
  label: string;
  name: string;
  required: boolean;
  value: Date;
}

export interface FormOutput {
  textInputArray: string[];
  numberInputArray: string[];
  selectInputArray: any[];
  dateInputArray: Date[];
}

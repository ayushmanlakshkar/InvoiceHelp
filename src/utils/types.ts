// Define template field types
export type FieldType = 'text' | 'number' | 'date' | 'select' | 'line-items';

// Define template field structure
export interface TemplateField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[]; // For select fields
  placeholder?: string; // The placeholder to be replaced in HTML
  calculateFrom?: string[]; // Fields to use for calculations
}

// Define line item structure for invoices
export interface LineItem {
  _rateInput: string;
  id: string;
  description: string;
  hsnCode: string;
  quantity: number;
  units: string;
  /** Float value representing the price per unit */
  rate: number;
  /** Float value representing the total amount (quantity * rate) */
  amount: number;
}

// Define template structure
export interface Template {
  id: string;
  name: string;
  description: string;
  fields: TemplateField[];
  html: string; // HTML content with placeholders
  supportLineItems?: boolean;
}

// Define navigation parameter types
export type RootStackParamList = {
  Home: undefined;
  TemplateSelection: undefined;
  FormFilling: { templateId: string };
  Preview: { templateId: string; formData: Record<string, any> };
  MyPDFs: undefined;
};
import { z } from 'zod';

export const quotationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  company: z.string().optional(),
  productType: z.string().min(1, 'Please select a product type'),
  quantity: z.string().min(1, 'Please specify quantity'),
  details: z.string().min(10, 'Details must be at least 10 characters'),
  timeline: z.string().optional(),
});

export type QuotationFormData = z.infer<typeof quotationSchema>;

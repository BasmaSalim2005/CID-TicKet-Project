export interface AddfeedbackRequest{
  comment: string;            // Required, min length 15
  applicationId?: number;     // Optional if nullable
  usability?: number;         // Optional if nullable
  satisfaction?: number;      // Optional, note lowercased property name!
  performance?: number;
  design?: number;
  reliability?: number;
  overall?: number;
  userEmail: string;          // Required
  appName?: string; 
    
}
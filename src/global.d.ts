// global.d.ts

interface PaystackResponse {
    reference: string;
    status: string;
    message?: string;
    [key: string]: unknown;
}

interface PaystackOptions {
    key: string;
    email: string;
    amount: number;
    currency?: string;
    ref?: string;
    metadata?: {
        custom_fields: Array<{
            display_name: string;
            variable_name: string;
            value: string;}>;
    };
    callback: (response: PaystackResponse) => void;
    onClose?: () => void;
  }
  
  interface PaystackSetup {
      setup: (options: PaystackOptions) => { openIframe: () => void };
  }

  interface Window {
    PaystackPop: PaystackSetup;
  }
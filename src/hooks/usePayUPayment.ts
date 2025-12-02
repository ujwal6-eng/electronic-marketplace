import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PaymentParams {
  orderId: string;
  amount: number;
  productInfo: string;
  firstName: string;
  email: string;
  phone?: string;
}

interface PaymentData {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  surl: string;
  furl: string;
  hash: string;
  action: string;
}

export function usePayUPayment() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const initiatePayment = async (params: PaymentParams): Promise<PaymentData | null> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('payu-payment', {
        body: {
          action: 'create-payment',
          ...params,
        },
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: 'Payment Initiated',
          description: 'Redirecting to payment gateway (Demo Mode)',
        });
        return data.paymentData;
      }

      throw new Error(data?.error || 'Failed to initiate payment');
    } catch (error: any) {
      toast({
        title: 'Payment Error',
        description: error.message || 'Failed to initiate payment',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const submitPayment = (paymentData: PaymentData) => {
    // Create a form and submit to PayU
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = paymentData.action;

    const fields = ['key', 'txnid', 'amount', 'productinfo', 'firstname', 'email', 'phone', 'surl', 'furl', 'hash'];
    
    fields.forEach(field => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = field;
      input.value = (paymentData as any)[field];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  return {
    initiatePayment,
    submitPayment,
    isLoading,
  };
}

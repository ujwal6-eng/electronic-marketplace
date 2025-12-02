import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Demo/Test credentials for PayU sandbox
const PAYU_MERCHANT_KEY = "gtKFFx"; // PayU test key
const PAYU_MERCHANT_SALT = "eCwWELxi"; // PayU test salt
const PAYU_BASE_URL = "https://test.payu.in"; // Sandbox URL

function generateHash(params: Record<string, string>, salt: string): string {
  const hashString = `${params.key}|${params.txnid}|${params.amount}|${params.productinfo}|${params.firstname}|${params.email}|||||||||||${salt}`;
  
  const encoder = new TextEncoder();
  const data = encoder.encode(hashString);
  
  // Using Web Crypto API for SHA-512
  return crypto.subtle.digest('SHA-512', data).then(hashBuffer => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }) as unknown as string;
}

async function generateHashAsync(params: Record<string, string>, salt: string): Promise<string> {
  const hashString = `${params.key}|${params.txnid}|${params.amount}|${params.productinfo}|${params.firstname}|${params.email}|||||||||||${salt}`;
  
  const encoder = new TextEncoder();
  const data = encoder.encode(hashString);
  const hashBuffer = await crypto.subtle.digest('SHA-512', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, orderId, amount, productInfo, firstName, email, phone, successUrl, failureUrl } = await req.json();

    if (action === 'create-payment') {
      const txnid = `TXN_${orderId}_${Date.now()}`;
      
      const params = {
        key: PAYU_MERCHANT_KEY,
        txnid: txnid,
        amount: amount.toString(),
        productinfo: productInfo || 'Order Payment',
        firstname: firstName || 'Customer',
        email: email || 'customer@example.com',
        phone: phone || '9999999999',
        surl: successUrl || `${req.headers.get('origin')}/orders?payment=success`,
        furl: failureUrl || `${req.headers.get('origin')}/orders?payment=failed`,
      };

      const hash = await generateHashAsync(params, PAYU_MERCHANT_SALT);

      return new Response(
        JSON.stringify({
          success: true,
          paymentData: {
            ...params,
            hash: hash,
            action: `${PAYU_BASE_URL}/_payment`,
          },
          message: 'Payment initiated (Demo Mode)',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'verify-payment') {
      const { mihpayid, status, txnid, amount: paidAmount, hash: responseHash } = await req.json();
      
      // Verify response hash
      const reverseHashString = `${PAYU_MERCHANT_SALT}|${status}|||||||||||${email}|${firstName}|${productInfo}|${paidAmount}|${txnid}|${PAYU_MERCHANT_KEY}`;
      const encoder = new TextEncoder();
      const data = encoder.encode(reverseHashString);
      const hashBuffer = await crypto.subtle.digest('SHA-512', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const calculatedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      const isValid = calculatedHash === responseHash;

      return new Response(
        JSON.stringify({
          success: isValid && status === 'success',
          verified: isValid,
          transactionId: mihpayid,
          status: status,
          message: isValid ? 'Payment verified successfully' : 'Payment verification failed',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('PayU payment error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Payment processing failed', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type EventType = 
  | 'page_view'
  | 'product_view'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'checkout_start'
  | 'checkout_complete'
  | 'search'
  | 'filter_applied'
  | 'technician_view'
  | 'booking_start'
  | 'booking_complete'
  | 'forum_post_view'
  | 'forum_post_create'
  | 'ai_chat_start'
  | 'ai_chat_message';

interface AnalyticsEvent {
  type: EventType;
  data?: Record<string, unknown>;
}

export function useAnalytics() {
  const { user } = useAuth();

  const track = useCallback(async (event: AnalyticsEvent) => {
    try {
      // Log to console in development
      if (import.meta.env.DEV) {
        console.log('[Analytics]', event.type, event.data);
      }

      // Store in database if user is logged in
      if (user) {
        await supabase.from('user_activity_log').insert([{
          user_id: user.id,
          activity_type: event.type,
          activity_data: event.data ? JSON.parse(JSON.stringify(event.data)) : null,
        }]);
      }

      // You can also send to external analytics services here
      // e.g., Google Analytics, Mixpanel, etc.
      
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }, [user]);

  const trackPageView = useCallback((pageName: string, pageUrl?: string) => {
    track({
      type: 'page_view',
      data: {
        page_name: pageName,
        page_url: pageUrl || window.location.pathname,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
      },
    });
  }, [track]);

  const trackProductView = useCallback((productId: string, productName: string, price: number) => {
    track({
      type: 'product_view',
      data: { product_id: productId, product_name: productName, price },
    });
  }, [track]);

  const trackAddToCart = useCallback((productId: string, productName: string, price: number, quantity: number) => {
    track({
      type: 'add_to_cart',
      data: { product_id: productId, product_name: productName, price, quantity },
    });
  }, [track]);

  const trackSearch = useCallback((query: string, resultsCount: number) => {
    track({
      type: 'search',
      data: { query, results_count: resultsCount },
    });
  }, [track]);

  const trackCheckout = useCallback((step: 'start' | 'complete', total: number, itemCount: number) => {
    track({
      type: step === 'start' ? 'checkout_start' : 'checkout_complete',
      data: { total, item_count: itemCount },
    });
  }, [track]);

  const trackBooking = useCallback((step: 'start' | 'complete', technicianId: string, serviceType: string) => {
    track({
      type: step === 'start' ? 'booking_start' : 'booking_complete',
      data: { technician_id: technicianId, service_type: serviceType },
    });
  }, [track]);

  return {
    track,
    trackPageView,
    trackProductView,
    trackAddToCart,
    trackSearch,
    trackCheckout,
    trackBooking,
  };
}

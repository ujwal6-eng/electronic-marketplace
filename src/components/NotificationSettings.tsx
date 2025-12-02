import { Bell, BellOff, Mail, MessageSquare, ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useState } from 'react';

interface NotificationPreferences {
  push: boolean;
  email: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  forumReplies: boolean;
  serviceReminders: boolean;
}

export function NotificationSettings() {
  const { 
    isSupported, 
    permission, 
    isSubscribed, 
    isLoading,
    requestPermission,
    subscribe,
    unsubscribe,
    sendTestNotification 
  } = usePushNotifications();

  const [preferences, setPreferences] = useState<NotificationPreferences>({
    push: isSubscribed,
    email: true,
    orderUpdates: true,
    promotions: false,
    forumReplies: true,
    serviceReminders: true,
  });

  const handlePushToggle = async (enabled: boolean) => {
    if (enabled) {
      const subscription = await subscribe();
      if (subscription) {
        setPreferences(prev => ({ ...prev, push: true }));
      }
    } else {
      await unsubscribe();
      setPreferences(prev => ({ ...prev, push: false }));
    }
  };

  const handlePreferenceChange = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    // In production, save to database
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Manage how you receive notifications from Electro
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Push Notifications */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            {isSubscribed ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
            Push Notifications
          </h4>
          
          {!isSupported ? (
            <p className="text-sm text-muted-foreground">
              Push notifications are not supported in this browser.
            </p>
          ) : permission === 'denied' ? (
            <p className="text-sm text-destructive">
              Notifications are blocked. Please enable them in your browser settings.
            </p>
          ) : (
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications" className="flex-1">
                <span className="font-medium">Enable push notifications</span>
                <p className="text-sm text-muted-foreground">
                  Receive instant updates even when you're not on the site
                </p>
              </Label>
              <Switch
                id="push-notifications"
                checked={preferences.push}
                onCheckedChange={handlePushToggle}
                disabled={isLoading}
              />
            </div>
          )}

          {isSubscribed && (
            <Button variant="outline" size="sm" onClick={sendTestNotification}>
              Send Test Notification
            </Button>
          )}
        </div>

        {/* Email Notifications */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-medium flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Notifications
          </h4>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications" className="flex-1">
              <span className="font-medium">Email notifications</span>
              <p className="text-sm text-muted-foreground">
                Receive updates via email
              </p>
            </Label>
            <Switch
              id="email-notifications"
              checked={preferences.email}
              onCheckedChange={(value) => handlePreferenceChange('email', value)}
            />
          </div>
        </div>

        {/* Notification Categories */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-medium">Notification Types</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="order-updates" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                <span>Order updates</span>
              </Label>
              <Switch
                id="order-updates"
                checked={preferences.orderUpdates}
                onCheckedChange={(value) => handlePreferenceChange('orderUpdates', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="promotions" className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span>Promotions & offers</span>
              </Label>
              <Switch
                id="promotions"
                checked={preferences.promotions}
                onCheckedChange={(value) => handlePreferenceChange('promotions', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="forum-replies" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span>Forum replies</span>
              </Label>
              <Switch
                id="forum-replies"
                checked={preferences.forumReplies}
                onCheckedChange={(value) => handlePreferenceChange('forumReplies', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="service-reminders" className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span>Service reminders</span>
              </Label>
              <Switch
                id="service-reminders"
                checked={preferences.serviceReminders}
                onCheckedChange={(value) => handlePreferenceChange('serviceReminders', value)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

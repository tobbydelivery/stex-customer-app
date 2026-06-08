import { registerRootComponent } from "expo";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import OfflineBanner from "./src/components/OfflineBanner";
import AppNavigator from "./src/navigation/AppNavigator";
import { registerForPushNotifications, saveDeviceToken } from "./src/services/notifications";
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "https://ab83d00f5555aaafc0c1d5831318c2f8@o4511527597768704.ingest.de.sentry.io/4511527606354000
",
  enableAutoSessionTracking: true,
  tracesSampleRate: 1.0,
  environment: "production"
});

// Inside the return, add at the top:
<View style={{ flex: 1 }}>
  <OfflineBanner />
  {/* rest of your app */}
</View>

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  })
});

const App = () => {
  useEffect(() => {
    initPushNotifications();
  }, []);

  const initPushNotifications = async () => {
    const token = await registerForPushNotifications();
    if (token) await saveDeviceToken(token);
  };

  return <AppNavigator />;
};

registerRootComponent(App);
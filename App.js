import { registerRootComponent } from "expo";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { registerForPushNotifications, saveDeviceToken } from "./src/services/notifications";

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

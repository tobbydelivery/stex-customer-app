import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import API from "./api";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  })
});

// Register for push notifications
export const registerForPushNotifications = async () => {
  try {
    if (!Device.isDevice) {
      console.log("Push notifications only work on physical devices");
      return null;
    }

    // Check permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Push notification permission denied");
      return null;
    }

    // Get Expo push token
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: "b3791597-3e38-421b-bfdb-7f21d4c49794"
    });

    // Android channel setup
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("stex_notifications", {
        name: "STeX Notifications",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#e74c3c",
        sound: "default"
      });
    }

    console.log("Push token:", token.data);
    return token.data;
  } catch (err) {
    console.error("Push registration error:", err);
    return null;
  }
};

// Save token to backend
export const saveDeviceToken = async (token) => {
  try {
    if (!token) return;
    await API.post("/auth/device-token", { deviceToken: token });
    console.log("Device token saved to backend");
  } catch (err) {
    console.error("Error saving device token:", err.message);
  }
};

// Setup notification listeners
export const setupNotificationListeners = (navigation) => {
  // Handle notification received while app is open
  const notificationListener = Notifications.addNotificationReceivedListener(notification => {
    console.log("Notification received:", notification);
  });

  // Handle notification tap
  const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
    const data = response.notification.request.content.data;
    if (data?.screen === "Track" && data?.trackingNumber) {
      navigation.navigate("Track", { trackingNumber: data.trackingNumber });
    } else if (data?.screen === "Orders") {
      navigation.navigate("Home");
    }
  });

  return { notificationListener, responseListener };
};

// Remove listeners
export const removeNotificationListeners = ({ notificationListener, responseListener }) => {
  Notifications.removeNotificationSubscription(notificationListener);
  Notifications.removeNotificationSubscription(responseListener);
};

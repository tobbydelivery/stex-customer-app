import NetInfo from "@react-native-community/netinfo";
import { Alert } from "react-native";

export const checkConnection = async () => {
  const state = await NetInfo.fetch();
  return state.isConnected;
};

export const withNetworkCheck = async (action) => {
  const isConnected = await checkConnection();
  if (!isConnected) {
    Alert.alert(
      "No Internet Connection",
      "Please check your internet connection and try again.",
      [{ text: "OK" }]
    );
    return false;
  }
  return action();
};
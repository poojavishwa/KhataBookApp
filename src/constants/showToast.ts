import Toast from "react-native-toast-message";

export const showToast = (type: "success" | "error" | "info", title: string, message?: string) => {
  Toast.show({
    type: type,
    text1: title,
    text2: message,
    position: "top", // You can change this to "bottom"
  });
};

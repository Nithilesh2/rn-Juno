import { StyleSheet, Text } from "react-native";

const fontFamilies = {
  "400": "PlusJakartaSans_400Regular",
  "500": "PlusJakartaSans_500Medium",
  "600": "PlusJakartaSans_600SemiBold",
  "700": "PlusJakartaSans_700Bold",
};

const AppText = ({ style, ...props }) => {
  const flattenedStyle = StyleSheet.flatten(style);
  const fontWeight = String(flattenedStyle?.fontWeight ?? "400");

  return (
    <Text
      {...props}
      style={[
        style,
        {
          fontFamily: fontFamilies[fontWeight] ?? fontFamilies["400"],
        },
      ]}
    />
  );
};

export default AppText;

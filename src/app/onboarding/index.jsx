import { Pressable, View } from "react-native";
import { router } from "expo-router";
import AppText from "../../components/AppText";

const index = () => {
  return (
    <View>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push("/onboarding/tabs")}
        style={{ alignSelf: "flex-start", paddingVertical: 8 }}
      >
        <AppText style={{ color: "#007AFF" }}>click to go next</AppText>
      </Pressable>
    </View>
  )
}

export default index

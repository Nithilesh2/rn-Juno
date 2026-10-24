import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import AppText from "../components/AppText";

const index = () => {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push("/onboarding/")}
        style={styles.button}
      >
        <AppText style={styles.buttonText}>click to go next</AppText>
      </Pressable>
    </View>
  )
}

export default index

const styles = StyleSheet.create({
  container: {
    top: 50
  },
  button: {
    alignSelf: "flex-start",
    paddingVertical: 8,
  },
  buttonText: {
    color: "#007AFF",
  },
})

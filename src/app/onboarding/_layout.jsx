import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

const _layout = () => {
  SplashScreen.preventAutoHideAsync()

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index"></Stack.Screen>
      <Stack.Screen name="tabs"></Stack.Screen>
    </Stack>
  )
}

export default _layout

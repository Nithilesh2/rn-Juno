import { Stack, usePathname } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const pathname = usePathname();
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (fontError) {
    throw fontError;
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {pathname === "/onboarding/tabs" && (
        <>
          <LinearGradient
            pointerEvents="none"
            colors={["#ECEAFF", "#F3F1FF", "#FFFFFF"]}
            locations={[0, 0.5, 1]}
            start={{ x: 0.9, y: 0 }}
            end={{ x: 0.1, y: 1 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 380,
            }}
          />
          <LinearGradient
            pointerEvents="none"
            colors={[
              "rgba(218, 255, 247, 0.85)",
              "rgba(218, 255, 247, 0.35)",
              "rgba(218, 255, 247, 0)",
            ]}
            locations={[0, 0.4, 1]}
            start={{ x: 0, y: 0.45 }}
            end={{ x: 1, y: 0.45 }}
            style={{
              position: "absolute",
              top: 48,
              left: 0,
              right: 0,
              height: 230,
            }}
          />
        </>
      )}
      <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "transparent" }}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "transparent" },
          }}
        >
          <Stack.Screen name="index" options={{ title: "index" }}></Stack.Screen>
          <Stack.Screen name="onboarding"></Stack.Screen>
        </Stack>
      </SafeAreaView>
    </View>
  )
}

export default RootLayout

import { FontAwesome, Ionicons } from "@expo/vector-icons";
import "react-native-reanimated";
import { useFonts } from "expo-font";
import { Link, Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";

import * as SecureStore from "expo-secure-store";

import Colors from "@/constants/Colors";

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      console.error("SecureStore get item error: ", err);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (!isLoaded) return;
    console.log("isSignedIn", isSignedIn);
  }, [isSignedIn]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="signup"
        options={{
          title: "",
          headerBackTitle: "",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons name="arrow-back" size={32} color={Colors.dark} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: "",
          headerBackTitle: "",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons name="arrow-back" size={32} color={Colors.dark} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <Link href="/help" asChild>
              <TouchableOpacity>
                <Ionicons
                  name="help-circle-outline"
                  size={34}
                  color={Colors.dark}
                />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name="help"
        options={{ title: "Help", presentation: "modal" }}
      />
      <Stack.Screen
        name="verify/[phone]"
        options={{
          title: "",
          headerBackTitle: "",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons name="arrow-back" size={32} color={Colors.dark} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
};

const RootLayoutNav = () => {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <StatusBar style="light" />
      <InitialLayout />
    </ClerkProvider>
  );
};

export default RootLayoutNav;

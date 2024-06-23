import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAssets } from "expo-asset";
import { ResizeMode, Video } from "expo-av";
import { Link } from "expo-router";

import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";

const App = () => {
  const [assets] = useAssets([require("@/assets/videos/intro.mp4")]);
  return (
    <View style={styles.container}>
      {assets && (
        <Video
          isMuted
          isLooping
          shouldPlay
          resizeMode={ResizeMode.COVER}
          source={{ uri: assets[0].uri }}
          style={styles.video}
        />
      )}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Your personal crypto investments!</Text>
      </View>
      <View style={styles.buttons}>
        <Link
          href="/login"
          style={[
            defaultStyles.pillButton,
            { flex: 1, backgroundColor: Colors.dark },
          ]}
          asChild
        >
          <TouchableOpacity>
            <Text
              style={{ color: Colors.white, fontSize: 22, fontWeight: "500" }}
            >
              Log in
            </Text>
          </TouchableOpacity>
        </Link>
        <Link
          href="/signup"
          style={[
            defaultStyles.pillButton,
            { flex: 1, backgroundColor: Colors.white },
          ]}
          asChild
        >
          <TouchableOpacity>
            <Text style={{ fontSize: 22, fontWeight: "500" }}>Sign up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  video: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  headerContainer: {
    marginTop: 80,
    padding: 20,
  },
  header: {
    fontSize: 36,
    fontWeight: "900",
    textTransform: "uppercase",
    color: "#fff",
  },
  buttons: {
    gap: 20,
    marginBottom: 60,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default App;

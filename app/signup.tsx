import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { useSignUp } from "@clerk/clerk-expo";

import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";

const SingUp = () => {
  const router = useRouter();
  const { signUp } = useSignUp();

  const keyboardVerticalOffset = Platform.OS === "ios" ? 80 : 0;
  const [countryCode, setCountryCode] = useState("+35");
  const [phoneNumber, setPhoneNumber] = useState("");

  const onSignUp = async () => {
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;

    try {
      await signUp!.create({
        phoneNumber: fullPhoneNumber,
      });

      signUp!.preparePhoneNumberVerification();

      router.push({
        pathname: "/verify/[phone]",
        params: { phone: fullPhoneNumber },
      });
    } catch (err) {
      console.log("error", JSON.stringify(err, null, 2));
    }
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={{ flex: 1 }}
      behavior="padding"
    >
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Let`s get started!</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter your phone number. We will send you a confirmation code there
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Country code"
            placeholderTextColor={Colors.gray}
            value={countryCode}
          />

          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Mobile number"
            placeholderTextColor={Colors.gray}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="numeric"
            autoFocus
          />
        </View>

        <Link href={"/login"} asChild replace>
          <TouchableOpacity>
            <Text style={defaultStyles.textLink}>
              Already have an account? Log in
            </Text>
          </TouchableOpacity>
        </Link>

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            styles.signUpButton,
            phoneNumber !== "" ? styles.enabled : styles.disabled,
          ]}
          onPress={onSignUp}
          disabled={phoneNumber === ""}
        >
          <Text style={defaultStyles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    marginTop: 40,
    marginBottom: 15,
  },

  input: {
    padding: 20,
    marginRight: 10,
    borderRadius: 16,
    fontSize: 20,
    backgroundColor: Colors.lightGray,
  },
  enabled: {
    backgroundColor: Colors.primary,
  },
  disabled: {
    backgroundColor: Colors.primaryMuted,
  },
  signUpButton: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: Colors.dark,
  },
});

export default SingUp;

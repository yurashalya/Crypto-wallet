import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useSignIn, isClerkAPIResponseError } from "@clerk/clerk-expo";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";

enum SignInType {
  Phone,
  Email,
  Google,
  Apple,
}

const RegistrationPage = () => {
  const router = useRouter();
  const { signIn } = useSignIn();

  const keyboardVerticalOffset = Platform.OS === "ios" ? 80 : 0;
  const [countryCode, setCountryCode] = useState("+49");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleLogin = async (type: SignInType) => {
    if (type === SignInType.Phone) {
      try {
        const fullPhoneNumber = `${countryCode}${phoneNumber}`;

        const { supportedFirstFactors } = await signIn!.create({
          identifier: fullPhoneNumber,
        });

        const firstPhoneFactor: any = supportedFirstFactors.find((factor) => {
          return factor.strategy === "phone_code";
        });

        const { phoneNumberId } = firstPhoneFactor;

        await signIn!.prepareFirstFactor({
          strategy: "phone_code",
          phoneNumberId,
        });
        router.push({
          pathname: "/verify/[phone]",
          params: { phone: fullPhoneNumber, signin: "true" },
        });
      } catch (err) {
        if (isClerkAPIResponseError(err)) {
          if (err.errors[0].code === "form_identifier_not_found") {
            Alert.alert("Error", err.errors[0].message);
          }
        }
      }
    }
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={{ flex: 1 }}
      behavior="padding"
    >
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Welcome back</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter the phone number associated with your account
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
          />
        </View>

        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            styles.signUpButton,
            phoneNumber !== "" ? styles.enabled : styles.disabled,
          ]}
          disabled={phoneNumber === ""}
          onPress={() => handleLogin(SignInType.Phone)}
        >
          <Text style={defaultStyles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <View style={styles.emailContent}>
          <View style={styles.line} />
          <Text style={{ color: Colors.gray, fontSize: 20 }}>or</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity
          style={[defaultStyles.pillButton, styles.otherLoginAction]}
          onPress={() => handleLogin(SignInType.Email)}
        >
          <Ionicons name="mail" size={24} color={Colors.black} />
          <Text style={[defaultStyles.buttonText, { color: Colors.black }]}>
            Continue with email
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[defaultStyles.pillButton, styles.otherLoginAction]}
          onPress={() => handleLogin(SignInType.Google)}
        >
          <Ionicons name="logo-google" size={24} color={Colors.black} />
          <Text style={[defaultStyles.buttonText, { color: Colors.black }]}>
            Continue with google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[defaultStyles.pillButton, styles.otherLoginAction]}
          onPress={() => handleLogin(SignInType.Apple)}
        >
          <Ionicons name="logo-apple" size={24} color={Colors.black} />
          <Text style={[defaultStyles.buttonText, { color: Colors.black }]}>
            Continue with google
          </Text>
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
  emailContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.gray,
  },
  otherLoginAction: {
    marginTop: 20,
    flexDirection: "row",
    gap: 16,
    backgroundColor: Colors.white,
  },
});

export default RegistrationPage;

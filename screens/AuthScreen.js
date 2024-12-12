import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, Image, Button } from "react-native";
import {
  createStaticNavigation,
  useNavigation,
} from "@react-navigation/native";

const AuthScreen = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(" ");
  const [password, setPassword] = useState(" ");
  const navigation = useNavigation();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the request starts
    try {
      const response = await fetch(
        "https://dearfutureme.onrender.com/signup    ",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );
      const data = await response.json();
      if (data.token) {
        navigation.navigate("OnboardingScreen");
      } else {
        alert("Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setLoading(false); // Reset loading to false after the request completes
    }
  };

  return (
    <View>
      {loading ? (
        <View>
          <Text>Loading....</Text>
        </View>
      ) : (
        <View>
          <TextInput />
          <TextInput placeholder="Email" onChangeText={setEmail} />
          <TextInput
            secureTextEntry={true}
            placeholder="Password"
            onChangeText={setPassword}
          />
          <Button title="Signup" onPress={handleSignup} />
        </View>
      )}
    </View>
  );
};

export default AuthScreen;

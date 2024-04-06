import { Link } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

export default function Page() {
  return (
    <View>
      <Link style={styles.loginContainer} href="/">
        <Text style={styles.loginText}>Create account</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    alignSelf: "center",
  },
  loginText: {
    color: "blue",
  },
});

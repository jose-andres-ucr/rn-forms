import { StyleSheet, View, TextInput as TextInputRn } from "react-native";

import { TextInput, Button, Text } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { router } from "expo-router";
import { useRef } from "react";

const form = z.object({
  pass: z
    .string()
    .min(5, { message: "Password must contain at least 5 characters" })
    .max(16, { message: "Password contain at most 16 characters" }),
  email: z.string().email(),
  fullName: z.string().min(1).max(50),
});
type FormData = z.infer<typeof form>;

export default function Page() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      pass: "",
      email: "",
      fullName: "",
    },
    resolver: zodResolver(form),
  });

  const refs = {
    passRef: useRef<TextInputRn>(null),
    fullNameRef: useRef<TextInputRn>(null),
  } as const;

  const onSubmit = (data: FormData) => {
    console.log(data);
    router.push("/success");
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, styles.text]}>Welcome stranger</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            mode="outlined"
            label="Email"
            style={styles.inputField}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoFocus
            returnKeyType="next"
            onSubmitEditing={() => {
              refs.passRef.current?.focus();
            }}
            blurOnSubmit={false}
          />
        )}
        name="email"
      />
      {errors.email ? (
        <Text style={styles.error}>{errors.email.message}</Text>
      ) : null}

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            ref={refs.passRef}
            mode="outlined"
            label="Password"
            secureTextEntry
            style={styles.inputField}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!errors.pass}
            autoCapitalize="none"
            autoComplete="password"
            returnKeyType="next"
            onSubmitEditing={() => {
              refs.fullNameRef.current?.focus();
            }}
            blurOnSubmit={false}
          />
        )}
        name="pass"
      />
      {errors.pass && <Text style={styles.error}>{errors.pass.message}</Text>}

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            ref={refs.fullNameRef}
            mode="outlined"
            label="Full Name"
            style={styles.inputField}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!errors.fullName}
            autoCapitalize="words"
          />
        )}
        name="fullName"
      />
      {errors.fullName ? (
        <Text style={styles.error}>{errors.fullName.message}</Text>
      ) : null}

      <Button
        style={styles.button}
        icon="send"
        mode="contained"
        onPress={handleSubmit(onSubmit)}
      >
        Sign up
      </Button>
      <Link style={styles.loginContainer} href="/login">
        <Text style={styles.loginText}>You already have an account?</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    padding: 28,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
  },
  text: {
    textAlign: "center",
    fontWeight: "bold",
  },
  inputField: {
    marginVertical: 6,
  },
  error: {
    color: "red",
  },
  button: {
    marginTop: 24,
    alignSelf: "center",
  },
  loginContainer: {
    alignSelf: "center",
  },
  loginText: {
    color: "blue",
  },
});

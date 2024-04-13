import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { View, StyleSheet, TextInput as TextInputRn } from "react-native";
import { Switch, Text, TextInput, Button } from "react-native-paper";
import { z } from "zod";

const baseForm = z.object({
  pass: z
    .string()
    .min(5, { message: "Password must contain at least 5 characters" })
    .max(16, { message: "Password contain at most 16 characters" }),
  email: z.string().email(),
});

const formWithMFA = baseForm.merge(
  z.object({
    mfa: z
      .string()
      .min(6)
      .max(6)
      .transform((value) => Number(value)),
  })
);

type FormData =
  | ({ type: "base" } & z.infer<typeof baseForm>)
  | ({ type: "mfa" } & z.infer<typeof formWithMFA>);

export default function Page() {
  const [mfa, setMfa] = React.useState(false);

  const refs = {
    passRef: React.useRef<TextInputRn>(null),
    mfaRef: React.useRef<TextInputRn>(null),
  } as const;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      pass: "",
      email: "",
      mfa: 0,
    },
    resolver: zodResolver(mfa ? formWithMFA : baseForm),
  });

  const toggleMfa = () => setMfa(!mfa);

  const onSubmit = (data: FormData) => {
    if (data.type === "base") {
      console.log(data);
    } else {
      console.log(data);
    }

    router.push("/success");
  };

  return (
    <View style={styles.root}>
      <View style={styles.switchContainer}>
        <Text>MFA</Text>
        <Switch style={styles.switch} value={mfa} onChange={toggleMfa} />
      </View>
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
            returnKeyType={mfa ? "next" : "default"}
            onSubmitEditing={() => {
              refs.mfaRef.current?.focus();
            }}
            blurOnSubmit={!mfa}
          />
        )}
        name="pass"
      />
      {errors.pass && <Text style={styles.error}>{errors.pass.message}</Text>}

      {mfa && (
        <>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={refs.mfaRef}
                mode="outlined"
                label="MFA"
                style={styles.inputField}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value === 0 ? "" : value.toString()}
                error={!errors.mfa}
                keyboardType="numeric"
              />
            )}
            name="mfa"
          />
          {errors.mfa ? (
            <Text style={styles.error}>{errors.mfa.message}</Text>
          ) : null}
        </>
      )}

      <Button
        style={styles.button}
        icon="send"
        mode="contained"
        onPress={handleSubmit((form) => {
          onSubmit(mfa ? { type: "mfa", ...form } : { type: "base", ...form });
        })}
      >
        Log In
      </Button>

      <Link style={styles.loginContainer} href="/">
        <Text style={styles.loginText}>Create account</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  switchContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  switch: { width: 50 },
  loginContainer: {
    alignSelf: "center",
  },
  loginText: {
    color: "blue",
  },
  inputField: {
    marginVertical: 6,
    width: "60%",
  },
  error: {
    color: "red",
  },
  button: {
    marginTop: 24,
    alignSelf: "center",
  },
});

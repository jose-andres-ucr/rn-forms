import { StyleSheet, View, Alert } from "react-native";

import { TextInput, Button, Text } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { router } from "expo-router";

const FormData = z
  .object({
    password: z
      .string()
      .min(5, { message: "Password must contain at least 5 characters" })
      .max(16, { message: "Password contain at most 16 characters" }),
    email: z.string().email(),
  })
  .superRefine((values, ctx) => {
    if (!values.password && !values.email) {
      ctx.addIssue({
        message: "Either password or email should be filled in.",
        code: z.ZodIssueCode.custom,
        path: ["password"],
      });
      ctx.addIssue({
        message: "Either password or email should be filled in.",
        code: z.ZodIssueCode.custom,
        path: ["email"],
      });
    }
  });

type FormData = z.infer<typeof FormData>;

export default function Page() {
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      email: "",
    },
    resolver: zodResolver(FormData),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    router.replace("/success");
  };

  const handleOnChangeText = (
    value: string,
    onChange: (...event: string[]) => void
  ) => {
    onChange(value);
    trigger();
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, styles.text]}>Welcome stranger</Text>

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            mode={"outlined"}
            label={"Email"}
            style={styles.inputField}
            onBlur={onBlur}
            onChangeText={(value: string) =>
              handleOnChangeText(value, onChange)
            }
            value={value}
            error={errors.email ? true : false}
            keyboardType={"email-address"}
            autoCapitalize="none"
            autoComplete="email"
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
            mode={"outlined"}
            label={"Password"}
            secureTextEntry
            style={styles.inputField}
            onBlur={onBlur}
            onChangeText={(value: string) =>
              handleOnChangeText(value, onChange)
            }
            value={value}
            error={errors.email ? true : false}
            autoCapitalize="none"
            autoComplete="email"
          />
        )}
        name="password"
      />
      {errors.password ? (
        <Text style={styles.error}>{errors.password.message}</Text>
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

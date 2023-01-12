import { loginRequest } from "./endpoints";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";

export const login = async (
  body: any,
) => {
  try {
    const response = await fetch(loginRequest, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (response.status == 200) {
      const result = await response.json();
      // save the credentials
      await SecureStoragePlugin.set({ key: "username", value: body.username });
      await SecureStoragePlugin.set({ key: "password", value: body.password });
      // save the access_token
      await SecureStoragePlugin.set({
        key: "token",
        value: result.access_token,
      });
	  return true
    } else {
      return false;
    }
  } catch (err) {
    console.log("Error during login: ", err);
  }
};

// called if request returns 401 => if (response.status == 401)
export const reauthenticate = async () => {
  const username = await SecureStoragePlugin.get({ key: "username" });
  const password = await SecureStoragePlugin.get({ key: "password" });
  const response = await fetch(loginRequest, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username.value,
      password: password.value,
      rememberMe: false,
    }),
  });
  const result = await response.json();
  await SecureStoragePlugin.set({ key: "token", value: result.access_token });
};

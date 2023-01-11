import { loginRequest } from "./endpoints";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";

export const login = async (
  body: any,
  success: () => void,
  failure: () => void
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
	  await SecureStoragePlugin.set({ key: "token", value: result.access_token });
      success();
    } else {
      failure();
    }
  } catch (err) {
    console.log("Error during login: ", err);
  }
};

// called if request returns 401 => if (response.status == 401)
export const reauthenticate = async () => {
  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");
  const response = await fetch(loginRequest, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
      rememberMe: false,
    }),
  });
  const result = await response.json();
  localStorage.setItem("token", result.access_token);
};

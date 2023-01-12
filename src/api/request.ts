import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import { reauthenticate } from "./login";

// possible infinite loop based on this logic, how to change it?
export const sendGetRequest = async (req: string) => {
  let token = await SecureStoragePlugin.get({ key: "token" });
  try {
    const response = await fetch(req, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
    });
    if (response.status == 401) {
      reauthenticate().then(() => {
        sendGetRequest(req);
      });
    }
    const data = await response.json();
    return data;
  } catch (err: any) {
    console.log("Error: ", err);
    return err;
  }
};

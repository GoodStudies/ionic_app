import { reauthenticate } from "./login";

export const sendGetRequest = async (req: string) => {
  try {
    const response = await fetch(req, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
		"Authorization": `Bearer ${localStorage.getItem("token")}`,
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

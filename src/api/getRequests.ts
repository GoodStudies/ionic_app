import { fixedQuestions } from "../App";

export const sendGetRequest = async (req: string) => {
  try {
    const response = await fetch(req, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Request failed!");
    }
    const data = await response.json();
    return data;
  } catch (err: any) {
    console.log("Error: ", err);
    return err;
  }
};

export const sendDeleteRequest = async (req: string) => {
  try {
    const response = await fetch(req, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Request failed!");
    }
    // const data = await response.json();
    // return data;
    console.log("Entry successfully deleted");
  } catch (err: any) {
    console.log("Error: ", err);
    return err;
  }
};

export const fetchFixedQuestions = async (req: string) => {
  try {
    sendGetRequest(req).then((fixed) => {
      for (let i = 0; i < fixed.length; i++) {
        fixedQuestions.push(fixed[i]);
      }
      console.log("fetched fixed questions");
    });
  } catch (err: any) {
    console.log("Error while fetching fixed questions: ", err);
  }
};

export const fetchQuestionGroups = async (req: string) => {
  sendGetRequest(req).then((groups) => {});
};

export const deleteServerData = async (req: string) => {
  try {
    sendGetRequest(req).then((questions) => {
      for (let i = 0; i < questions.length; i++) {
        sendDeleteRequest(req + "/" + questions[i].id).then((res) => {
          console.log("Deleted question with id: " + questions[i].id);
        });
      }
    });
    console.log("Successfully deleted all entries");
  } catch {
    console.log("Error while deleting server data");
  }
};

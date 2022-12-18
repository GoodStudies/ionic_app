import { fixedQuestions } from "../App";

export const sendRequest = async (req: string) => {
  try {
    const response = await fetch(req, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (err: any) {
    console.log("Error: ", err);
    return err;
  }
};

export const fetchFixedQuestions = async (req: string) => {
  sendRequest(req).then((fixed) => {
    for (let i = 0; i < fixed.length; i++) {
      fixedQuestions.push(fixed[i]);
      console.log("question: " + fixed[i].question_name);
    }
    console.log("length: " + fixed.length);
    console.log("finished");
  });
};

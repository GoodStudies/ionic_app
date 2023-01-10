import { fixedQuestions } from "../App";
import { sendGetRequest } from "./request";

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

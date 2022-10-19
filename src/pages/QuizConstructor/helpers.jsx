import { QuestionTemplate } from "./template";

export const templateWithKey = (amount) => Array.from(Array(amount), (_, i) => <QuestionTemplate key={i} />);

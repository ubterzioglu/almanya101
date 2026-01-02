export type AnswerRow = {
  id: string;
  body: string;
  status: string;
  created_at: string;
};

export type QuestionRow = {
  id: string;
  title: string;
  slug: string;
  body: string;
  status: string;
  created_at: string;
  answers: AnswerRow[];
};

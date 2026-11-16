export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestPayload {
    url: string;
    method: HttpMethod;
    headers?: Record<string, string>;
    body?: BodyInit;
    credentials?: RequestCredentials;
}

export interface ApiResponse<T> {
    message: string;
    payload: T;
}

// What a paged read answers with: one page of rows plus the numbers a
// paginator needs.
export interface Page<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}

// What the admin panel mints: an address and the code that only works for it.
export interface Invite {
    email: string;
    code: string;
}

export interface SubmittedAnswer {
    questionId: string;
    selected: string[];
}

export interface QuestionResult {
    questionId: string;
    correct: boolean;
    correctAnswers: string[];
}

export interface StoredAnswer {
    question: string;
    selected: string[];
}

export interface Attempt {
    _id: string;
    user: string;
    quiz: string;
    correctCount: number;
    questionCount: number;
    percent: number;
    answers: StoredAnswer[];
    createdAt: string;
    updatedAt: string;
}

// What POST quiz/:id/submit answers with. The results carry the correct
// answers, which is the only time the server hands them out.
export interface SubmitResult {
    attempt: Attempt;
    correctCount: number;
    questionCount: number;
    percent: number;
    results: QuestionResult[];
}

export interface AttemptSummary {
    count: number;
    best: number;
    average: number;
    last: number;
}

export interface AttemptHistoryEntry {
    percent: number;
    createdAt: string;
}

export interface QuizStats extends AttemptSummary {
    history: AttemptHistoryEntry[];
}

export interface OverallStats extends AttemptSummary {
    quizzes: (QuizStats & { quizId: string; title: string })[];
}

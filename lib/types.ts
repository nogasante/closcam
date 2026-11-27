export type Difficulty = "easy" | "medium";

export type Surface =
  | "chat"
  | "sms"
  | "call"
  | "payment_page"
  | "scene"
  | "prompt";

export type Source = {
  name: string;
  url: string;
};

export type Choice = {
  id: string;
  text: string;
  correct: boolean;
};

export type ChatMessage = {
  sender: string;
  time: string;
  text: string;
};

export type Step =
  | {
      type: "chat";
      contact: string;
      messages: ChatMessage[];
    }
  | {
      type: "sms";
      sender: string;
      messages: ChatMessage[];
    }
  | {
      type: "sms_preview";
      sender: string;
      text: string;
    }
  | {
      type: "call";
      callerId: string;
      callerLabel: string;
      lines: string[];
    }
  | {
      type: "payment_page";
      url: string;
      title: string;
      merchant: string;
      amount: string;
      buttonLabel: string;
      finePrint: string;
    }
  | {
      type: "scene";
      place: string;
      speaker: string;
      line: string;
    }
  | {
      type: "prompt";
      title: string;
      body: string;
      amount: string;
      destination: string;
    };

export type Scenario = {
  id: string;
  number: number;
  title: string;
  headline: boolean;
  difficulty: Difficulty;
  surfaces: Surface[];
  setup: string;
  steps: Step[];
  choices: Choice[];
  redFlags: string[];
  lesson: string;
  sources: Source[];
};

export type ScenarioFile = {
  version: number;
  scenarios: Scenario[];
};

export type DrillResult = {
  correct: boolean;
  at: string;
};

export type Progress = {
  results: Record<string, DrillResult>;
};

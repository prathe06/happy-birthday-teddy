export type LevelId = 1 | 2 | 3 | 4 | 5 | 6;

export type BearMood =
  | 'idle'
  | 'happy'
  | 'excited'
  | 'thinking'
  | 'cheering'
  | 'celebrating'
  | 'camera'
  | 'envelope';

export interface LevelMeta {
  id: LevelId;
  shortLabel: string;
  title: string;
}

export interface GameProgress {
  currentLevel: LevelId;
  highestUnlockedLevel: LevelId;
  completedLevels: LevelId[];
  goldenHeartsTotal: number;
  quizSolvedIndices: number[];
  missionAccepted: boolean;
  envelopeUnlocked: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  successNote: string;
}

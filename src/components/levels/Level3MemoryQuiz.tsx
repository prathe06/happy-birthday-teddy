import React, { useState } from 'react';
import { ArrowRightCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import { QuizQuestion } from '../../types/game';
import { BubuBear } from '../characters/BubuBear';
import { DuduBear } from '../characters/DuduBear';
import { GoldenHeart } from '../characters/GoldenHeart';
import { soundManager } from '../../utils/sound';

interface EnrichedQuizQuestion extends QuizQuestion {
  chapterTag: string;
  accentBg: string;
  accentBorder: string;
  sceneIcon: 'food' | 'pink' | 'grad' | 'white';
}

const QUIZ_QUESTIONS: EnrichedQuizQuestion[] = [
  {
    id: 1,
    chapterTag: 'First Meet · Bite',
    accentBg: 'bg-[#FFF3E0]',
    accentBorder: 'border-[#FDBA74]',
    sceneIcon: 'food',
    question: 'What did we go to eat during our first meet?',
    options: ['Biryani', 'Mandi', 'Pizza', 'Momos'],
    correctAnswer: 'Mandi',
    hint: 'Think of that big flavourful platter we shared on our very first meet!',
    successNote: 'Yes! That Mandi platter kicked off our story! 💛',
  },
  {
    id: 2,
    chapterTag: 'First Meet · Twin Vibe',
    accentBg: 'bg-[#FCE7F3]',
    accentBorder: 'border-[#F9A8D4]',
    sceneIcon: 'pink',
    question: 'Which colour did we unexpectedly match during our first meet?',
    options: ['Blue', 'Black', 'Pink', 'Yellow'],
    correctAnswer: 'Pink',
    hint: 'A cheerful pastel shade we both wore without planning it!',
    successNote: 'Unexpected Pink twinning—such a sweet coincidence! 💛',
  },
  {
    id: 3,
    chapterTag: 'Second Meet · Milestone',
    accentBg: 'bg-[#E0F2FE]',
    accentBorder: 'border-[#7DD3FC]',
    sceneIcon: 'grad',
    question: 'What was the occasion of our second meet?',
    options: [
      "A friend's birthday",
      "My sister's graduation",
      'College cultural fest',
      'Weekend movie plan',
    ],
    correctAnswer: "My sister's graduation",
    hint: 'A proud family celebration day filled with happy smiles!',
    successNote: "Right! Celebrating my sister's graduation day! 💛",
  },
  {
    id: 4,
    chapterTag: 'Second Meet · Dress Code',
    accentBg: 'bg-[#F8FAFC]',
    accentBorder: 'border-[#CBD5E1]',
    sceneIcon: 'white',
    question: 'Which colour did we both wear during the second meet?',
    options: ['Pink', 'Sky Blue', 'White', 'Beige'],
    correctAnswer: 'White',
    hint: 'This time we actually planned our bright classic colour!',
    successNote: 'Crisp matching White outfits—10/10 coordination! 💛',
  },
];

interface Level3MemoryQuizProps {
  solvedIndices: number[];
  onSolveQuestion: (index: number) => void;
  onComplete: () => void;
}

const SceneIllustration: React.FC<{ kind: EnrichedQuizQuestion['sceneIcon'] }> = ({
  kind,
}) => {
  if (kind === 'food') {
    return (
      <svg width="56" height="56" viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <ellipse cx="32" cy="44" rx="24" ry="9" fill="#FED7AA" stroke="#9A3412" strokeWidth="2.5" />
        <path d="M14 40C16 26 48 26 50 40Z" fill="#FDE047" stroke="#9A3412" strokeWidth="2.5" />
        <circle cx="26" cy="34" r="3" fill="#EA580C" />
        <circle cx="37" cy="33" r="3" fill="#16A34A" />
        <path d="M24 19Q22 14 25 10" stroke="#9A3412" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M33 17Q31 12 34 8" stroke="#9A3412" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === 'pink') {
    return (
      <svg width="56" height="56" viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path
          d="M14 20L22 14H42L50 20L46 28L41 26V48H23V26L18 28L14 20Z"
          fill="#F9A8D4"
          stroke="#9D174D"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <circle cx="32" cy="33" r="4" fill="#FFD700" />
      </svg>
    );
  }
  if (kind === 'grad') {
    return (
      <svg width="56" height="56" viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <polygon points="32,14 56,25 32,36 8,25" fill="#7DD3FC" stroke="#0369A1" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M18 30V43C18 46 46 46 46 43V30" fill="#BAE6FD" stroke="#0369A1" strokeWidth="2.5" />
        <path d="M51 27V42" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="51" cy="44" r="3" fill="#FFD700" />
      </svg>
    );
  }
  return (
    <svg width="56" height="56" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M14 20L22 14H42L50 20L46 28L41 26V48H23V26L18 28L14 20Z"
        fill="#FFFFFF"
        stroke="#475569"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M27 14L32 21L37 14" stroke="#94A3B8" strokeWidth="2.2" strokeLinejoin="round" />
    </svg>
  );
};

export const Level3MemoryQuiz: React.FC<Level3MemoryQuizProps> = ({
  solvedIndices,
  onSolveQuestion,
  onComplete,
}) => {
  const firstUnsolved = QUIZ_QUESTIONS.findIndex(
    (_, idx) => !solvedIndices.includes(idx)
  );
  const [currentIdx, setCurrentIdx] = useState<number>(
    firstUnsolved === -1 ? 0 : firstUnsolved
  );
  const [wrongOption, setWrongOption] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'wrong'>(
    solvedIndices.includes(currentIdx) ? 'correct' : 'idle'
  );
  const [heartBurstKey, setHeartBurstKey] = useState(0);

  const q = QUIZ_QUESTIONS[currentIdx];
  const isCurrentSolved =
    solvedIndices.includes(currentIdx) || feedbackState === 'correct';
  const allSolved = QUIZ_QUESTIONS.every((_, idx) =>
    solvedIndices.includes(idx)
  );

  const handleOptionClick = (option: string) => {
    if (isCurrentSolved) return;

    if (option === q.correctAnswer) {
      soundManager.playCorrect();
      setWrongOption(null);
      setFeedbackState('correct');
      setHeartBurstKey((k) => k + 1);
      onSolveQuestion(currentIdx);
    } else {
      soundManager.playWrong();
      setWrongOption(option);
      setFeedbackState('wrong');
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setWrongOption(null);
      setFeedbackState(solvedIndices.includes(nextIdx) ? 'correct' : 'idle');
    } else if (allSolved || isCurrentSolved) {
      soundManager.playLevelComplete();
      onComplete();
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF7] to-[#FFF0F6]/70 border border-[#F3DCE4] rounded-3xl shadow-sm p-5 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <p className="text-xs font-bold text-[#9D174D]">
            Level 3 · Our Little Memory Quiz
          </p>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#4A3531]">
            Memory Scrapbook Challenge
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          {QUIZ_QUESTIONS.map((item, idx) => {
            const solved = solvedIndices.includes(idx);
            const active = idx === currentIdx;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setCurrentIdx(idx);
                  setWrongOption(null);
                  setFeedbackState(solved ? 'correct' : 'idle');
                }}
                className={`w-8 h-8 rounded-xl font-display font-bold text-xs border transition-all cursor-pointer tabular-nums ${
                  active
                    ? 'bg-[#FFD700] border-[#B45309] text-[#4A3531]'
                    : solved
                    ? 'bg-[#ECFDF5] border-[#6EE7B7] text-[#065F46]'
                    : 'bg-white border-[#E7D8D3] text-[#7D635D]'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Distinct Theme Scene Banner per Question */}
      <div
        className={`relative flex items-center justify-between gap-3 py-4 px-4 sm:px-6 rounded-2xl border mb-5 transition-colors ${q.accentBg} ${q.accentBorder}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white/90 border border-black/10 flex items-center justify-center shrink-0">
            <SceneIllustration kind={q.sceneIcon} />
          </div>
          <div>
            <p className="text-xs font-bold text-[#5E4742]">{q.chapterTag}</p>
            <p className="font-display font-bold text-sm sm:text-base text-[#4A3531]">
              {feedbackState === 'correct'
                ? 'Memory Unlocked!'
                : feedbackState === 'wrong'
                ? 'Hmm, try another clue!'
                : `Memory Card ${currentIdx + 1} of ${QUIZ_QUESTIONS.length}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {feedbackState === 'correct' ? (
            <div key={heartBurstKey} className="flex items-center gap-1 mr-1">
              <GoldenHeart size={22} className="animate-heart-bob" />
              <GoldenHeart size={28} className="animate-heart-bob" />
            </div>
          ) : null}
          <DuduBear
            mood={
              feedbackState === 'correct'
                ? 'cheering'
                : feedbackState === 'wrong'
                ? 'thinking'
                : 'happy'
            }
            size={64}
            facing="right"
          />
          <BubuBear
            mood={
              feedbackState === 'correct'
                ? 'celebrating'
                : feedbackState === 'wrong'
                ? 'thinking'
                : 'idle'
            }
            size={64}
            facing="left"
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white border border-[#EADAD3] rounded-2xl p-5 sm:p-6">
        <h3 className="font-display text-lg sm:text-xl font-bold text-[#4A3531] mb-4">
          {q.id}. {q.question}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {q.options.map((opt) => {
            const isCorrectOpt = isCurrentSolved && opt === q.correctAnswer;
            const isWrongOpt = wrongOption === opt;

            return (
              <button
                key={opt}
                type="button"
                disabled={isCurrentSolved}
                onClick={() => handleOptionClick(opt)}
                className={`w-full text-left px-4 py-3.5 rounded-2xl font-bold text-sm sm:text-base border-2 transition-all flex items-center justify-between gap-2 min-h-[52px] ${
                  isCorrectOpt
                    ? 'bg-[#FEF9C3] border-[#D97706] text-[#4A3531] shadow-xs'
                    : isWrongOpt
                    ? 'bg-[#FFE4E6] border-[#FDA4AF] text-[#9F1239]'
                    : isCurrentSolved
                    ? 'bg-[#FAF6F4] border-[#ECE3DF] text-[#9A857F] cursor-default'
                    : 'bg-[#FFFDF7] border-[#E7D8D3] text-[#4A3531] hover:bg-[#FFF0F6] hover:border-[#F9A8D4] cursor-pointer active:scale-[0.99]'
                }`}
              >
                <span>{opt}</span>
                {isCorrectOpt && <GoldenHeart size={22} glow={false} />}
              </button>
            );
          })}
        </div>

        {feedbackState === 'wrong' && (
          <div className="mt-4 flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#FFF1F2] border border-[#FECDD3] text-sm font-semibold text-[#9F1239]">
            <HelpCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p>Not quite that one! You can try again.</p>
              <p className="text-xs text-[#BE123C] mt-0.5">Hint: {q.hint}</p>
            </div>
          </div>
        )}

        {isCurrentSolved && (
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#FEF9C3]/75 border border-[#FDE047]">
            <div className="flex items-center gap-2.5 text-[#713F12] font-bold text-sm sm:text-base">
              <CheckCircle2 className="w-5 h-5 text-[#B45309] shrink-0" />
              <span>{q.successNote}</span>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFD700] hover:bg-[#FACC15] text-[#4A3531] font-display font-bold text-sm sm:text-base border-2 border-[#B45309] shadow-[0_3px_0_#B45309] cursor-pointer whitespace-nowrap"
            >
              <span>
                {currentIdx < QUIZ_QUESTIONS.length - 1
                  ? 'Next Memory Card'
                  : 'Unlock Level 4'}
              </span>
              <ArrowRightCircle className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

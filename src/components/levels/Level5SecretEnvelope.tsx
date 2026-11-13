import React, { useState } from 'react';
import { ArrowRightCircle, LockOpen, MailOpen } from 'lucide-react';
import { BubuBear } from '../characters/BubuBear';
import { DuduBear } from '../characters/DuduBear';
import { GoldenHeart } from '../characters/GoldenHeart';
import { soundManager } from '../../utils/sound';

interface Level5SecretEnvelopeProps {
  envelopeUnlocked: boolean;
  onUnlockEnvelope: () => void;
  onContinue: () => void;
}

type CardKind = 'heart' | 'camera' | 'cake';

interface SealCard {
  uid: number;
  kind: CardKind;
  label: string;
}

const INITIAL_CARDS: SealCard[] = [
  { uid: 0, kind: 'heart', label: 'Golden Heart' },
  { uid: 1, kind: 'camera', label: 'Camera' },
  { uid: 2, kind: 'cake', label: 'Birthday Cake' },
  { uid: 3, kind: 'camera', label: 'Camera' },
  { uid: 4, kind: 'cake', label: 'Birthday Cake' },
  { uid: 5, kind: 'heart', label: 'Golden Heart' },
];

export const Level5SecretEnvelope: React.FC<Level5SecretEnvelopeProps> = ({
  envelopeUnlocked,
  onUnlockEnvelope,
  onContinue,
}) => {
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedKinds, setMatchedKinds] = useState<CardKind[]>([]);
  const [checking, setChecking] = useState(false);
  const [openingAnim, setOpeningAnim] = useState(false);

  const handleCardTap = (uid: number) => {
    if (envelopeUnlocked || openingAnim || checking) return;
    const card = INITIAL_CARDS[uid];
    if (matchedKinds.includes(card.kind)) return;
    if (flippedIndices.includes(uid)) return;

    soundManager.playClick();
    const nextFlipped = [...flippedIndices, uid];
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length === 2) {
      const [firstUid, secondUid] = nextFlipped;
      const firstCard = INITIAL_CARDS[firstUid];
      const secondCard = INITIAL_CARDS[secondUid];

      if (firstCard.kind === secondCard.kind) {
        soundManager.playHeartCollect();
        const nextMatched = [...matchedKinds, firstCard.kind];
        setMatchedKinds(nextMatched);
        setFlippedIndices([]);

        if (nextMatched.length === 3) {
          soundManager.playCorrect();
          setOpeningAnim(true);
          window.setTimeout(() => {
            soundManager.playLevelComplete();
            onUnlockEnvelope();
            setOpeningAnim(false);
          }, 700);
        }
      } else {
        setChecking(true);
        window.setTimeout(() => {
          setFlippedIndices([]);
          setChecking(false);
        }, 620);
      }
    }
  };

  const renderCardSymbol = (kind: CardKind) => {
    if (kind === 'heart') {
      return <GoldenHeart size={32} glow={false} />;
    }
    if (kind === 'camera') {
      return (
        <span className="text-2xl select-none" aria-label="Camera">
          📷
        </span>
      );
    }
    return (
      <span className="text-2xl select-none" aria-label="Birthday Cake">
        🎂
      </span>
    );
  };

  return (
    <section className="bg-gradient-to-b from-[#FFF0F6]/80 via-[#FFFDF7] to-[#FEF9C3]/40 border border-[#F3DCE4] rounded-3xl shadow-sm p-5 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-5">
          <p className="text-xs sm:text-sm font-bold text-[#9D174D] mb-1">
            Level 5 · The Secret Envelope
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#4A3531]">
            {envelopeUnlocked
              ? 'A Special Letter for You, Teddy 💛'
              : 'Match the 3 Ribbon Pairs to Open'}
          </h2>
        </div>

        {/* Characters Carrying the Sealed Envelope */}
        <div className="flex items-center justify-center gap-2 sm:gap-5 mb-6">
          <DuduBear
            mood={envelopeUnlocked ? 'cheering' : 'envelope'}
            size={90}
            facing="right"
          />
          <GoldenHeart
            size={30}
            className={envelopeUnlocked ? 'animate-heart-bob' : ''}
          />
          <BubuBear
            mood={envelopeUnlocked ? 'celebrating' : 'happy'}
            size={90}
            facing="left"
          />
        </div>

        {!envelopeUnlocked ? (
          <div className="relative mx-auto max-w-md bg-[#FFF8EB] border-2 border-[#E6C79C] rounded-3xl p-5 sm:p-6 shadow-sm text-center">
            {/* Envelope Visual */}
            <div
              className={`mx-auto mb-4 w-full max-w-[270px] h-28 relative rounded-2xl bg-[#FFFDF7] border-2 border-[#D9B88F] overflow-hidden shadow-xs transition-transform duration-500 ${
                openingAnim ? 'scale-105' : ''
              }`}
            >
              <svg
                viewBox="0 0 300 120"
                className="w-full h-full"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 120L150 56L300 120"
                  stroke="#D9B88F"
                  strokeWidth="3"
                  fill="#FDF4E3"
                />
                <path
                  d="M0 0L150 72L300 0"
                  stroke="#D9B88F"
                  strokeWidth="3"
                  fill={openingAnim ? '#FEF9C3' : '#F8E7CA'}
                  className="transition-all duration-500"
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`w-12 h-12 rounded-full bg-[#FFD700] border-2 border-[#B45309] flex items-center justify-center shadow-sm transition-transform duration-500 ${
                    openingAnim ? 'scale-125 opacity-0' : ''
                  }`}
                >
                  <GoldenHeart size={24} glow={false} />
                </div>
              </div>
            </div>

            <p className="text-sm font-bold text-[#5E4742] mb-1">
              Flip two cards at a time to find all 3 matching pairs ({matchedKinds.length}/3)
            </p>
            <p className="text-xs text-[#7D635D] mb-4">
              Unlocks Dudu &amp; Bubu&apos;s sealed birthday letter!
            </p>

            {/* 6-Card Memory Flip Grid */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 max-w-[300px] mx-auto">
              {INITIAL_CARDS.map((card) => {
                const isMatched = matchedKinds.includes(card.kind);
                const isRevealed = isMatched || flippedIndices.includes(card.uid);

                return (
                  <button
                    key={card.uid}
                    type="button"
                    disabled={isRevealed}
                    onClick={() => handleCardTap(card.uid)}
                    aria-label={isRevealed ? card.label : 'Hidden ribbon card'}
                    className={`h-20 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
                      isMatched
                        ? 'bg-[#FEF9C3] border-[#D97706] shadow-2xs cursor-default'
                        : isRevealed
                        ? 'bg-white border-[#7DD3FC] cursor-default'
                        : 'bg-gradient-to-br from-[#FCE7F3] to-[#E0F2FE] border-[#D9B88F] hover:scale-[1.03] active:scale-95 cursor-pointer'
                    }`}
                  >
                    {isRevealed ? (
                      renderCardSymbol(card.kind)
                    ) : (
                      <span className="font-display font-bold text-lg text-[#9D174D]">
                        ?
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {openingAnim && (
              <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[#B45309]">
                <LockOpen className="w-4 h-4" />
                <span>Breaking the golden seal...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="relative bg-[#FFFDF8] border-2 border-[#E9D5B5] rounded-3xl p-6 sm:p-9 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#F2E5CF] pb-3 mb-5">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#9D174D]">
                <MailOpen className="w-4 h-4" />
                <span>Secret Birthday Letter</span>
              </div>
              <GoldenHeart size={24} glow={false} />
            </div>

            <div className="font-hand text-2xl sm:text-[26px] leading-relaxed text-[#3D2B27] space-y-4">
              <p className="font-bold text-[#854D0E]">Happy Birthday, Teddy! 💗🎂</p>

              <p>
                Ungaluku inniku birthday, so ungalukaaga indha chinna surprise
                create pannanum nu thonuchu. 🤭
              </p>

              <p>
                Namma first meet-la unexpected-ah pink outfits match aana
                moment-lendhu, akka graduation day-la planned-ah white outfits
                potta varaikkum, namakku rendu meet memories irukku. Aana oru
                photo kooda illaye! 😂📸
              </p>

              <p>
                Neenga photographer-ah irundhuttu, namma rendu perukkum oru
                proper photo illama irukkuradhu konjam funny dhaan. So namma
                next meet-la indha missing photo kandippa edukkanum. Idhu oru
                small reminder! 🤍
              </p>

              <p>
                Neenga enakku romba special-aana best friend. Namma share panra
                little moments-um conversations-um enakku happy-ah irukkum.
              </p>

              <p>
                Ungaloda birthday romba nalla poganum. Neenga nenakkura goals
                ellame achieve pannanum, neraya happy moments experience
                pannanum, and eppovume unga passion-ah continue pannanum.
              </p>

              <p>
                Neenga already enna pathi konjam therinjavanga dhaan, so naan
                inga perusa explanation kudukka poradhilla. 😂🤭
              </p>

              <p>
                Best friends-ah irundhaalum, sila people namakku konjam extra
                special-ah iruppanga. Avlodhaan solluven!
              </p>

              <p>
                Innum neraya memories create pannuvom, neraya pesuvom, and indha
                vaati photo edukka marandhuda koodadhu. Okay-va? 📸💗
              </p>

              <p>
                Happy Birthday once again, Teddy! Ungaluku indha year full-ah
                happiness, success, and beautiful memories kidaikkanum.
              </p>

              <p>
                P.S. Photographer sir, namma first proper picture-ku nalla
                angle choose pannunga. Six feet height irukkuradhunaala camera
                angle responsibility ungalukku dhaan. 😂🎀
              </p>

              <p className="font-bold text-[#854D0E] pt-1">
                With lots of care,
                <br />
                Ungaloda best friend 💗
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#F2E5CF] flex justify-center">
              <button
                type="button"
                onClick={() => {
                  soundManager.playBirthdayCelebration();
                  onContinue();
                }}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-[#FFD700] hover:bg-[#FACC15] text-[#4A3531] font-display font-bold text-base sm:text-lg border-2 border-[#B45309] shadow-[0_4px_0_#B45309] cursor-pointer"
              >
                <span>Open Final Birthday Surprise!</span>
                <ArrowRightCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

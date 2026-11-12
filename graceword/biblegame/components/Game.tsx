"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { LocalizedStory } from "@/data/stories";
import { decodeChallenge, encodeChallenge } from "@/lib/challenge";
import {
  dailyDateKey,
  pickDailySession,
  pickDailyStory,
} from "@/lib/daily";
import type { Locale } from "@/lib/i18n/config";
import { fill, formatDailyDate, localeNumber } from "@/lib/i18n/format";
import { absoluteUrl, localePath } from "@/lib/i18n/paths";
import type { UiText } from "@/lib/i18n/types";
import type { MapLabel } from "@/lib/map-labels";
import { formatYear, MAX_QUESTION, scoreQuestion, scoreTier } from "@/lib/scoring";
import {
  getStats,
  recordDailyScore,
  recordStoryResult,
  type Stats,
} from "@/lib/storage";
import { getStoryPlayMode } from "@/lib/story-access";
import type {
  GameQuestion,
  LatLng,
  ScoredResult,
} from "@/lib/types";
import GuessOptions from "./GuessOptions";
import MapGuess from "./MapGuess";
import ShareGrid from "./ShareGrid";
import ResultMeta from "./ResultMeta";
import ResultNotes from "./ResultNotes";
import ResultSummary from "./ResultSummary";
import StoryRecap from "./StoryRecap";
import YearSlider from "./YearSlider";
import ZoomImage from "./ZoomImage";

type Phase = "answer" | "locate" | "result" | "summary";

interface GameProps {
  locale: Locale;
  questions: GameQuestion[];
  stories: LocalizedStory[];
  text: UiText;
  labels: MapLabel[];
}

export default function Game({
  locale,
  questions,
  stories,
  text,
  labels,
}: GameProps) {
  const [mounted, setMounted] = useState(false);
  const [locked, setLocked] = useState(false);
  const [invalidChallenge, setInvalidChallenge] = useState(false);
  const [challenge, setChallenge] = useState(false);
  const [challengeIds, setChallengeIds] = useState<string[]>([]);
  const [friendScore, setFriendScore] = useState<number | undefined>(undefined);
  const [challengeCopied, setChallengeCopied] = useState(false);
  const [practice, setPractice] = useState(false);
  const [daily, setDaily] = useState<GameQuestion[]>([]);
  const [story, setStory] = useState<LocalizedStory | null>(null);
  const [date, setDate] = useState("");
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("answer");
  const [wrong, setWrong] = useState<string[]>([]);
  const [yearTouched, setYearTouched] = useState(false);
  const [yearGuess, setYearGuess] = useState(30);
  const [guessPoint, setGuessPoint] = useState<LatLng | null>(null);
  const [results, setResults] = useState<ScoredResult[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const now = new Date();
    const currentStats = getStats();
    const todayStory = pickDailyStory(now, stories);
    const todayId = todayStory?.id ?? null;
    const params = new URLSearchParams(window.location.search);
    const challengeToken = params.get("challenge");
    const overrideId = params.get("story");
    const overrideStory = overrideId
      ? stories.find((item) => item.id === overrideId) ?? null
      : null;

    if (challengeToken) {
      const decoded = decodeChallenge(challengeToken);
      const ids = decoded?.ids ?? [];
      const byId = new Map(questions.map((question) => [question.id, question]));
      const challengeQuestions = ids
        .map((id) => byId.get(id))
        .filter((question): question is GameQuestion => Boolean(question));

      if (challengeQuestions.length > 0) {
        setDaily(challengeQuestions);
        setStory(null);
        setPractice(false);
        setChallenge(true);
        setChallengeIds(ids);
        setFriendScore(decoded?.score);
        setLocked(false);
        setInvalidChallenge(false);
        setDate(dailyDateKey(now));
        setStats(currentStats);
        setMounted(true);
        return;
      }

      setInvalidChallenge(true);
      setDate(dailyDateKey(now));
      setStats(currentStats);
      setMounted(true);
      return;
    }

    if (overrideStory) {
      const mode = getStoryPlayMode(
        overrideStory.id,
        todayId,
        currentStats.stories[overrideStory.id],
      );
      const isDev = process.env.NODE_ENV === "development";

      if (mode === "locked" && !isDev) {
        setLocked(true);
        setDate(dailyDateKey(now));
        setStats(currentStats);
        setMounted(true);
        return;
      }

      const byId = new Map(questions.map((question) => [question.id, question]));
      const overrideQuestions = overrideStory.questionIds
        .map((id) => byId.get(id))
        .filter((question): question is GameQuestion => Boolean(question));

      if (overrideQuestions.length > 0) {
        setDaily(overrideQuestions);
        setStory(overrideStory);
        setPractice(mode !== "daily");
        setChallenge(false);
        setChallengeIds([]);
        setFriendScore(undefined);
        setLocked(false);
        setInvalidChallenge(false);
        setDate(dailyDateKey(now));
        setStats(currentStats);
        setMounted(true);
        return;
      }
    }

    const session = pickDailySession(now, stories, questions);
    setDaily(session.questions);
    setStory(session.type === "story" ? session.story : null);
    setPractice(false);
    setChallenge(false);
    setChallengeIds([]);
    setFriendScore(undefined);
    setLocked(false);
    setInvalidChallenge(false);
    setDate(dailyDateKey(now));
    setStats(currentStats);
    setMounted(true);
  }, [questions, stories]);

  if (invalidChallenge) {
    return (
      <div className="card mx-auto max-w-xl space-y-4 p-8 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">
          {text.game.challengeLabel}
        </p>
        <h1 className="text-xl font-semibold">
          {text.game.challengeInvalid}
        </h1>
        <Link
          href={localePath(locale, "/progress/")}
          className="inline-block rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gold/85"
        >
          {text.progress.title}
        </Link>
      </div>
    );
  }

  if (locked) {
    return (
      <div className="card mx-auto max-w-xl space-y-4 p-8 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">
          {text.stories.notCompleted}
        </p>
        <h1 className="text-xl font-semibold">{text.stories.title}</h1>
        <p className="text-sm leading-relaxed text-ink/60">
          {text.stories.unlockHint}
        </p>
        <Link
          href={localePath(locale, "/stories/")}
          className="inline-block rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gold/85"
        >
          {text.stories.backToStories}
        </Link>
      </div>
    );
  }

  if (!mounted || daily.length === 0) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-40 animate-pulse rounded bg-ink/10" />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="aspect-[4/3] animate-pulse rounded-2xl bg-ink/10" />
          <div className="space-y-3">
            <div className="h-40 animate-pulse rounded-2xl bg-ink/10" />
            <div className="h-12 animate-pulse rounded-xl bg-ink/10" />
          </div>
        </div>
      </div>
    );
  }

  const current = daily[index];
  const totalScore = results.reduce((sum, result) => sum + result.total, 0);
  const lastResult = results[results.length - 1] ?? null;
  const scale = phase === "answer" ? Math.max(1, 3 - wrong.length * 0.65) : 1;
  const progress =
    phase === "summary"
      ? 100
      : Math.round((index / daily.length) * 100);
  const anchorQuestion = story
    ? questions.find((question) => question.id === story.anchorQuestionId)
    : undefined;
  const isPractice = practice && Boolean(story);
  const isChallenge = challenge;
  const storyProgress = story ? stats?.stories[story.id] : undefined;

  function choose(option: string) {
    if (phase !== "answer") return;
    if (option === current.answer) {
      setYearTouched(false);
      setPhase("locate");
    } else if (!wrong.includes(option)) {
      setWrong([...wrong, option]);
    }
  }

  function submitLocate() {
    if (!guessPoint || !yearTouched) return;
    const scored = scoreQuestion({
      question: current,
      yearGuess,
      guess: guessPoint,
      wrongCount: wrong.length,
    });
    setResults([...results, scored]);
    setPhase("result");
  }

  function next() {
    if (index + 1 >= daily.length) {
      const total = results.reduce((sum, result) => sum + result.total, 0);
      if (!isPractice && !isChallenge) setStats(recordDailyScore(total));
      if (story) {
        setStats(
          recordStoryResult(
            story.id,
            total,
            MAX_QUESTION * daily.length,
            new Date(),
          ),
        );
      }
      setPhase("summary");
      return;
    }
    setIndex(index + 1);
    setPhase("answer");
    setWrong([]);
    setYearTouched(false);
    setYearGuess(30);
    setGuessPoint(null);
  }

  async function copyChallengeLink(ids: string[], score: number) {
    if (ids.length === 0) return;
    const token = encodeChallenge(ids, score);
    const url = `${absoluteUrl(localePath(locale, "/play/"))}?challenge=${token}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const area = document.createElement("textarea");
      area.value = url;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
    }
    setChallengeCopied(true);
    window.setTimeout(() => setChallengeCopied(false), 1800);
  }

  function restart() {
    setIndex(0);
    setPhase("answer");
    setWrong([]);
    setYearTouched(false);
    setYearGuess(30);
    setGuessPoint(null);
    setResults([]);
  }

  if (phase === "summary") {
    const total = results.reduce((sum, result) => sum + result.total, 0);
    const tier = scoreTier(total, locale);
    const eyebrow = isChallenge
      ? `${formatDailyDate(date, locale)} · ${text.game.challengeLabel}`
      : isPractice
        ? `${formatDailyDate(date, locale)} · ${story?.title} · ${text.stories.practiceMode}`
        : story
          ? `${formatDailyDate(date, locale)} · ${story.title} · ${text.summary.storyComplete}`
          : `${formatDailyDate(date, locale)} · ${text.summary.title}`;

    return (
      <div className="mx-auto max-w-xl space-y-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">
            {eyebrow}
          </p>
          <p className="mt-3 text-6xl font-bold tabular-nums text-gold">
            {localeNumber(total, locale)}
          </p>
          <p className="text-sm text-ink/50">
            {fill(text.summary.perfect, {
              max: localeNumber(MAX_QUESTION * daily.length, locale),
            })}
          </p>
          <p className="mt-4 text-xl font-semibold">{tier.label}</p>
          <p className="mt-1 text-sm text-ink/60">{tier.note}</p>
        </div>

        {isChallenge ? (
          <div className="card space-y-3 p-4 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-gold">
              {text.game.challengeLabel}
            </p>

            {typeof friendScore === "number" ? (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-ink/45">
                      {text.game.challengeFriendScore}
                    </p>
                    <p className="text-xl font-semibold tabular-nums text-gold">
                      {localeNumber(friendScore, locale)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-ink/45">
                      {text.game.challengeYourScore}
                    </p>
                    <p className="text-xl font-semibold tabular-nums text-ink/80">
                      {localeNumber(total, locale)}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gold">
                  {total > friendScore
                    ? fill(text.game.challengeWin, {
                        diff: localeNumber(total - friendScore, locale),
                      })
                    : total < friendScore
                      ? fill(text.game.challengeLose, {
                          diff: localeNumber(friendScore - total, locale),
                        })
                      : text.game.challengeTie}
                </p>
              </>
            ) : (
              <p className="text-sm leading-relaxed text-ink/55">
                {text.game.challengeNoFriendScore}
              </p>
            )}

            <p className="text-xs leading-relaxed text-ink/50">
              {text.game.challengeShareHint}
            </p>
            <button
              type="button"
              onClick={() => copyChallengeLink(challengeIds, total)}
              className="w-full rounded-xl border border-ink/15 px-4 py-2.5 text-sm font-semibold transition hover:border-gold hover:text-gold"
            >
              {challengeCopied
                ? text.game.challengeCopied
                : text.game.shareChallengeScore}
            </button>
          </div>
        ) : isPractice ? (
          <div className="card space-y-2 p-4 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-gold">
              {text.stories.practiceMode}
            </p>
            <p className="text-2xl font-semibold tabular-nums text-gold">
              {localeNumber(storyProgress?.bestScore ?? total, locale)}
            </p>
            <p className="text-xs text-ink/50">
              {fill(text.stories.storyBest, {
                score: localeNumber(storyProgress?.bestScore ?? total, locale),
              })}
            </p>
            <p className="text-xs text-ink/50">{text.stories.practiceNote}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="card px-4 py-4">
              <p className="text-2xl font-semibold tabular-nums text-gold">
                {stats?.streak ?? 0}
              </p>
              <p className="mt-1 text-xs text-ink/55">{text.summary.streak}</p>
            </div>
            <div className="card px-4 py-4">
              <p className="text-2xl font-semibold tabular-nums text-gold">
                {localeNumber(stats?.bestScore ?? 0, locale)}
              </p>
              <p className="mt-1 text-xs text-ink/55">{text.summary.best}</p>
            </div>
          </div>
        )}

        {story && (
          <StoryRecap
            story={story}
            questions={daily}
            results={results}
            locale={locale}
            text={text}
            labels={labels}
          />
        )}

        {!isPractice && (
          <ShareGrid
            results={results}
            total={total}
            date={date}
            locale={locale}
            text={text.share}
            context={isChallenge ? text.game.challengeLabel : story?.title}
          />
        )}

        {!isPractice && !isChallenge && (
          <div className="card space-y-2 p-4 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-gold">
              {text.game.challengeDailyTitle}
            </p>
            <p className="text-xs leading-relaxed text-ink/50">
              {text.game.challengeDailyIntro}
            </p>
            <button
              type="button"
              onClick={() => copyChallengeLink(daily.map((question) => question.id), total)}
              className="w-full rounded-xl border border-ink/15 px-4 py-2.5 text-sm font-semibold transition hover:border-gold hover:text-gold"
            >
              {challengeCopied
                ? text.game.challengeCopied
                : text.game.shareChallengeScore}
            </button>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={restart}
            className="flex-1 rounded-xl bg-gold px-4 py-3 text-sm font-semibold text-white transition hover:bg-gold/85"
          >
            {text.summary.playAgain}
          </button>
          <Link
            href={localePath(
              locale,
              isChallenge ? "/progress/" : isPractice ? "/stories/" : "/",
            )}
            className="flex-1 rounded-xl border border-ink/15 px-4 py-3 text-center text-sm font-semibold transition hover:border-gold hover:text-gold"
          >
            {isChallenge
              ? text.progress.title
              : isPractice
                ? text.stories.backToStories
                : text.summary.backHome}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gold">
              {formatDailyDate(date, locale)} ·{" "}
              {isChallenge
                ? text.game.challengeLabel
                : story
                  ? `${story.title}${isPractice ? ` · ${text.stories.practiceMode}` : ""}`
                  : text.game.mixedLabel}
            </p>
            <h1 className="mt-1 text-xl font-semibold sm:text-2xl">
              {story
                ? fill(text.game.storySceneOf, {
                    current: index + 1,
                    total: daily.length,
                  })
                : fill(text.game.questionOf, {
                    current: index + 1,
                    total: daily.length,
                  })}
            </h1>
          </div>
          <div className="text-right">
            <p className="text-xs text-ink/50">{text.game.cumulative}</p>
            <p className="text-lg font-semibold tabular-nums text-gold">
              {localeNumber(totalScore, locale)}
            </p>
          </div>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
          <div
            className="h-full rounded-full bg-gold transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        {isChallenge && index === 0 && (
          <p className="mt-3 text-xs text-ink/50">{text.game.challengeNote}</p>
        )}
        {story && index === 0 && (
          <div className="mt-3 space-y-1">
            <p className="text-sm leading-relaxed text-ink/60">
              {story.intro}
            </p>
            {anchorQuestion?.keyVerse.text && (
              <p className="text-xs leading-relaxed text-ink/45">
                <span className="font-semibold text-gold">
                  {text.game.keyVerseTitle}：
                </span>
                {anchorQuestion.keyVerse.text}
                <span className="ml-1">{anchorQuestion.keyVerse.ref}</span>
              </p>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ZoomImage
            key={current.id}
            src={current.image.src}
            alt={text.game.imageAlt}
            scale={scale}
            priority={index === 0}
          />
          {phase === "answer" && (
            <p className="mt-3 text-center text-xs text-ink/50">
              {text.game.zoomHint}
            </p>
          )}
        </div>

        <div className="space-y-4">
          {phase === "answer" && (
            <div className="card p-5">
              <p className="text-sm text-ink/65">{text.game.answerPrompt}</p>
              <div className="mt-4">
                <GuessOptions
                  options={current.options}
                  wrong={wrong}
                  ariaLabel={text.options.aria}
                  onSelect={choose}
                />
              </div>
              {wrong.length > 0 && (
                <div className="mt-4 space-y-2">
                  {current.verseHints[0] && (
                    <div className="rounded-lg bg-gold/10 px-3 py-2 text-sm text-ink/70">
                      <p className="font-semibold text-gold">
                        {text.game.scriptureHint} · {current.verseHints[0].ref}
                      </p>
                      <p className="mt-1 leading-relaxed">
                        {current.verseHints[0].text}
                      </p>
                    </div>
                  )}
                  {wrong.length > 1 && (
                    <p className="rounded-lg bg-gold/10 px-3 py-2 text-sm text-ink/70">
                      <span className="font-semibold text-gold">
                        {fill(text.game.hint, { n: 2 })}
                      </span>
                      {current.hints[1]}
                    </p>
                  )}
                  {wrong.length > 2 && (
                    <p className="rounded-lg bg-gold/10 px-3 py-2 text-sm text-ink/70">
                      <span className="font-semibold text-gold">
                        {fill(text.game.hint, { n: 3 })}
                      </span>
                      {current.hints[2]}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {phase === "locate" && (
            <div className="card space-y-5 p-5">
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs text-white">
                  ✓
                </span>
                {fill(text.game.identified, { answer: current.answer })}
              </div>

              <div className="rounded-xl border border-gold/30 bg-gold/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-gold">
                  {text.game.yearStepTitle}
                </p>
                <div className="mt-2">
                  <YearSlider
                    value={yearGuess}
                    onChange={setYearGuess}
                    locale={locale}
                    prompt={text.year.prompt}
                    touched={yearTouched}
                    onInteract={() => setYearTouched(true)}
                    unselectedLabel={text.game.yearUnselected}
                    decreaseLabel={text.game.yearDecrease}
                    increaseLabel={text.game.yearIncrease}
                  />
                </div>
              </div>


              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gold">
                  {text.game.locationStepTitle}
                </p>
                <p className="mt-1 text-sm font-medium text-ink/70">
                  {text.game.mapPrompt}
                </p>
                {current.regionName && (
                  <p className="mt-1 text-xs text-ink/55">
                    <span className="font-semibold text-gold">
                      {text.game.locationHint}：
                    </span>
                    {current.regionName}
                  </p>
                )}
                <div className="mt-2">
                  <MapGuess
                    guess={guessPoint}
                    onGuess={setGuessPoint}
                    labels={labels}
                    mapText={text.map}
                    hideLabels={[current.event.placeName]}
                  />
                </div>
                <p className="mt-1 text-xs text-ink/50">
                  {guessPoint
                    ? fill(text.game.marked, {
                        lat: guessPoint.lat.toFixed(2),
                        lng: guessPoint.lng.toFixed(2),
                      })
                    : text.game.notSelected}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 rounded-lg bg-ink/5 px-3 py-2 text-xs">
                <span
                  className={
                    yearTouched ? "text-emerald-700" : "text-ink/45"
                  }
                >
                  {yearTouched
                    ? `${text.game.yearChosen}：${formatYear(yearGuess, locale)}`
                    : text.game.yearNotChosen}
                </span>
                <span
                  className={guessPoint ? "text-emerald-700" : "text-ink/45"}
                >
                  {guessPoint
                    ? text.game.locationMarked
                    : text.game.locationNotMarked}
                </span>
              </div>

              <button
                type="button"
                onClick={submitLocate}
                disabled={!guessPoint || !yearTouched}
                className="w-full rounded-xl bg-gold px-4 py-3 text-sm font-semibold text-white transition enabled:hover:bg-gold/85 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {text.game.submit}
              </button>
              {(!guessPoint || !yearTouched) && (
                <p className="text-center text-xs text-ink/45">
                  {text.game.submitIncomplete}
                </p>
              )}
            </div>
          )}

          {phase === "result" && lastResult && (
            <div className="space-y-4">
              <div className="card p-5">
                <ResultSummary
                  question={current}
                  result={lastResult}
                  locale={locale}
                  text={text.game}
                />
              </div>

              <div className="card p-4">
                <p className="mb-2 text-xs text-ink/55">{text.game.mapLegend}</p>
                <MapGuess
                  guess={lastResult.guess}
                  onGuess={() => undefined}
                  labels={labels}
                  mapText={text.map}
                  actual={{ lat: current.event.lat, lng: current.event.lng }}
                  actualLabel={current.event.placeName}
                  revealed
                />
              </div>

              <ResultNotes question={current} text={text.game} />

              <ResultMeta question={current} text={text.game} />

              <button
                type="button"
                onClick={next}
                className="w-full rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-parchment transition hover:bg-ink/85"
              >
                {index + 1 >= daily.length
                  ? text.game.viewSummary
                  : text.game.next}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

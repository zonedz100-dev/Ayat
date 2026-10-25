import { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  CircleHelp,
  Clock3,
  GraduationCap,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { LEARNING_LESSONS, LearningLesson } from '../data/learningContent';

interface LearningProgress {
  completedLessonIds: string[];
  bestQuizScores: Record<string, number>;
}

const PROGRESS_KEY = 'ayat_learning_progress_v1';
const EMPTY_PROGRESS: LearningProgress = { completedLessonIds: [], bestQuizScores: {} };

function loadProgress(): { progress: LearningProgress; storageAvailable: boolean } {
  try {
    const saved = localStorage.getItem(PROGRESS_KEY);
    if (!saved) return { progress: EMPTY_PROGRESS, storageAvailable: true };

    const parsed: unknown = JSON.parse(saved);
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !('completedLessonIds' in parsed) ||
      !Array.isArray(parsed.completedLessonIds) ||
      !('bestQuizScores' in parsed) ||
      !parsed.bestQuizScores ||
      typeof parsed.bestQuizScores !== 'object'
    ) {
      return { progress: EMPTY_PROGRESS, storageAvailable: true };
    }

    return {
      progress: {
        completedLessonIds: parsed.completedLessonIds.filter((id): id is string => typeof id === 'string'),
        bestQuizScores: Object.fromEntries(
          Object.entries(parsed.bestQuizScores).filter(
            ([id, score]) => typeof id === 'string' && typeof score === 'number' && Number.isFinite(score),
          ),
        ),
      },
      storageAvailable: true,
    };
  } catch {
    return { progress: EMPTY_PROGRESS, storageAvailable: false };
  }
}

type HubScreen =
  | { type: 'catalog' }
  | { type: 'lesson'; lesson: LearningLesson }
  | { type: 'quiz'; lesson: LearningLesson }
  | { type: 'result'; lesson: LearningLesson; score: number };

export function LearningHub() {
  const [initialState] = useState(loadProgress);
  const [progress, setProgress] = useState(initialState.progress);
  const [storageAvailable, setStorageAvailable] = useState(initialState.storageAvailable);
  const [screen, setScreen] = useState<HubScreen>({ type: 'catalog' });
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const completedCount = progress.completedLessonIds.filter((id) =>
    LEARNING_LESSONS.some((lesson) => lesson.id === id),
  ).length;
  const completionPercent = LEARNING_LESSONS.length
    ? Math.round((completedCount / LEARNING_LESSONS.length) * 100)
    : 0;

  const persistProgress = (nextProgress: LearningProgress) => {
    setProgress(nextProgress);
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(nextProgress));
      setStorageAvailable(true);
    } catch {
      setStorageAvailable(false);
    }
  };

  const openQuiz = (lesson: LearningLesson) => {
    setQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setScreen({ type: 'quiz', lesson });
  };

  const completeQuestion = () => {
    if (screen.type !== 'quiz' || selectedAnswer === null) return;
    const nextAnswers = [...answers, selectedAnswer];
    setAnswers(nextAnswers);
    if (questionIndex < screen.lesson.questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
      setSelectedAnswer(null);
      return;
    }

    const score = nextAnswers.reduce(
      (total, answer, index) => total + Number(answer === screen.lesson.questions[index].correctIndex),
      0,
    );
    const previousBest = progress.bestQuizScores[screen.lesson.id] ?? 0;
    persistProgress({
      ...progress,
      bestQuizScores: { ...progress.bestQuizScores, [screen.lesson.id]: Math.max(score, previousBest) },
    });
    setScreen({ type: 'result', lesson: screen.lesson, score });
  };

  if (screen.type === 'catalog') {
    return (
      <section className="mx-auto w-full max-w-5xl pb-28 md:pb-10" dir="rtl" aria-labelledby="learning-title">
        <div className="relative mb-6 overflow-hidden rounded-[2rem] border border-emerald-300/15 bg-gradient-to-br from-emerald-950 via-[#0d211d] to-[#111a19] p-6 shadow-xl sm:p-9">
          <div className="pointer-events-none absolute -left-12 -top-16 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200/15 bg-emerald-100/5 px-3 py-1.5 text-xs font-semibold text-emerald-200">
                <Sparkles className="h-4 w-4" />
                تعلّم على مهل، أينما كنت
              </div>
              <h1 id="learning-title" className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                رحلتك في التعلّم
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-7 text-slate-300 sm:text-base">
                دروس قصيرة واختبارات تفاعلية تحفظ تقدّمك على هذا الجهاز، وتعمل دون اتصال بالإنترنت.
              </p>
            </div>
            <div className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 sm:w-64">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-slate-300">إنجازك في الدروس</span>
                <span className="font-bold text-emerald-200">{completionPercent}٪</span>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full bg-white/10"
                role="progressbar"
                aria-label="نسبة إكمال الدروس"
                aria-valuenow={completionPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-l from-emerald-300 to-teal-400 transition-all"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-400">
                {completedCount} من {LEARNING_LESSONS.length} دروس مكتملة
              </p>
            </div>
          </div>
          {!storageAvailable && (
            <p role="status" className="relative mt-5 rounded-xl border border-amber-300/20 bg-amber-400/10 px-4 py-3 text-sm leading-6 text-amber-100">
              تعذّر الوصول إلى التخزين المحلي؛ يمكنك متابعة التعلّم، لكن لن يُحفظ تقدمك بعد إغلاق التطبيق.
            </p>
          )}
        </div>

        {LEARNING_LESSONS.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-14 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-slate-500" />
            <h2 className="mt-4 text-lg font-bold text-white">لا توجد دروس متاحة الآن</h2>
            <p className="mt-2 text-sm text-slate-400">أضف محتوى تعليمياً محلياً إلى التطبيق ليظهر هنا.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {LEARNING_LESSONS.map((lesson, index) => {
              const completed = progress.completedLessonIds.includes(lesson.id);
              const bestScore = progress.bestQuizScores[lesson.id];
              return (
                <article
                  key={lesson.id}
                  className="group rounded-3xl border border-white/[0.08] bg-[#0d1110] p-5 transition-colors hover:border-emerald-300/25 sm:p-6"
                >
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${index % 2 ? 'bg-sky-300/10 text-sky-200' : 'bg-emerald-300/10 text-emerald-200'}`}>
                      <BookOpen className="h-5 w-5" />
                    </div>
                    {completed ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-300/10 px-2.5 py-1 text-xs font-semibold text-emerald-200">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        مكتمل
                      </span>
                    ) : (
                      <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-slate-400">{lesson.category}</span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-white">{lesson.title}</h2>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">{lesson.introduction}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" /> {lesson.duration} دقائق</span>
                    <span className="inline-flex items-center gap-1.5"><CircleHelp className="h-3.5 w-3.5" /> {lesson.questions.length} أسئلة</span>
                    {typeof bestScore === 'number' && <span>أفضل نتيجة: {bestScore}/{lesson.questions.length}</span>}
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setScreen({ type: 'lesson', lesson })}
                      className="min-h-11 rounded-xl border border-white/10 px-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/5"
                    >
                      اقرأ الدرس
                    </button>
                    <button
                      type="button"
                      onClick={() => openQuiz(lesson)}
                      className="min-h-11 rounded-xl bg-emerald-300 px-3 text-sm font-bold text-emerald-950 transition-colors hover:bg-emerald-200"
                    >
                      ابدأ الاختبار
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
        <p className="mt-5 text-center text-xs leading-6 text-slate-500">
          محتوى تعريفي للتعلّم، ويُرجع في الأحكام والمسائل الخاصة إلى أهل العلم.
        </p>
      </section>
    );
  }

  if (screen.type === 'lesson') {
    const { lesson } = screen;
    const completed = progress.completedLessonIds.includes(lesson.id);
    return (
      <section className="mx-auto w-full max-w-3xl pb-28 md:pb-10" dir="rtl">
        <button type="button" onClick={() => setScreen({ type: 'catalog' })} className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-xl px-2 text-sm font-semibold text-slate-300 hover:bg-white/5">
          <ArrowRight className="h-4 w-4" /> كل الدروس
        </button>
        <article className="rounded-3xl border border-white/[0.08] bg-[#0d1110] p-5 sm:p-9">
          <span className="rounded-full bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold text-emerald-200">{lesson.category} · {lesson.duration} دقائق</span>
          <h1 className="mt-5 text-2xl font-extrabold text-white sm:text-3xl">{lesson.title}</h1>
          <p className="mt-3 leading-7 text-slate-300">{lesson.introduction}</p>
          <div className="mt-7 space-y-6">
            {lesson.sections.map((section, index) => (
              <section key={section.heading} className="border-r-2 border-emerald-300/30 pr-4">
                <h2 className="font-bold text-emerald-100">{index + 1}. {section.heading}</h2>
                <p className="mt-2 leading-8 text-slate-300">{section.body}</p>
              </section>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 border-t border-white/[0.08] pt-6 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                if (!completed) persistProgress({ ...progress, completedLessonIds: [...progress.completedLessonIds, lesson.id] });
                openQuiz(lesson);
              }}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-300 px-4 font-bold text-emerald-950 hover:bg-emerald-200"
            >
              <Check className="h-4 w-4" /> {completed ? 'تابع إلى الاختبار' : 'أكملت الدرس، اختبر فهمك'}
            </button>
            <button type="button" onClick={() => openQuiz(lesson)} className="min-h-12 rounded-xl border border-white/10 px-5 font-semibold text-slate-200 hover:bg-white/5">
              ابدأ الاختبار
            </button>
          </div>
          {!storageAvailable && (
            <p role="status" className="mt-4 text-sm leading-6 text-amber-200">تعذّر حفظ تقدمك محلياً على هذا الجهاز.</p>
          )}
        </article>
      </section>
    );
  }

  if (screen.type === 'quiz') {
    const { lesson } = screen;
    const question = lesson.questions[questionIndex];
    const isCorrect = selectedAnswer === question.correctIndex;
    return (
      <section className="mx-auto w-full max-w-2xl pb-28 md:pb-10" dir="rtl">
        <button type="button" onClick={() => setScreen({ type: 'catalog' })} className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-xl px-2 text-sm font-semibold text-slate-300 hover:bg-white/5">
          <ArrowRight className="h-4 w-4" /> كل الدروس
        </button>
        <div className="rounded-3xl border border-white/[0.08] bg-[#0d1110] p-5 sm:p-8">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="font-semibold text-emerald-200">{lesson.title}</span>
            <span className="text-slate-400">السؤال {questionIndex + 1} من {lesson.questions.length}</span>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-emerald-300 transition-all" style={{ width: `${((questionIndex + 1) / lesson.questions.length) * 100}%` }} />
          </div>
          <h1 className="mt-8 text-xl font-bold leading-8 text-white sm:text-2xl">{question.question}</h1>
          <div className="mt-5 space-y-3">
            {question.choices.map((choice, index) => {
              const selected = selectedAnswer === index;
              const correct = selectedAnswer !== null && index === question.correctIndex;
              return (
                <button
                  key={choice}
                  type="button"
                  disabled={selectedAnswer !== null}
                  onClick={() => setSelectedAnswer(index)}
                  className={`flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl border px-4 text-right text-sm leading-6 transition-colors ${
                    correct ? 'border-emerald-300/50 bg-emerald-300/10 text-emerald-100'
                      : selected && !isCorrect ? 'border-rose-300/40 bg-rose-300/10 text-rose-100'
                        : 'border-white/10 bg-black/10 text-slate-200 hover:border-white/20 hover:bg-white/[0.03] disabled:hover:border-white/10 disabled:hover:bg-black/10'
                  }`}
                >
                  <span>{choice}</span>
                  {correct && <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-300" />}
                </button>
              );
            })}
          </div>
          {selectedAnswer !== null && (
            <p role="status" className={`mt-4 rounded-xl px-4 py-3 text-sm leading-6 ${isCorrect ? 'bg-emerald-300/10 text-emerald-100' : 'bg-amber-300/10 text-amber-100'}`}>
              {isCorrect ? 'إجابة صحيحة. ' : 'ليست الإجابة الصحيحة. '}{question.explanation}
            </p>
          )}
          <button
            type="button"
            disabled={selectedAnswer === null}
            onClick={completeQuestion}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-300 px-4 font-bold text-emerald-950 hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {questionIndex === lesson.questions.length - 1 ? 'عرض النتيجة' : 'السؤال التالي'}
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </section>
    );
  }

  const { lesson, score } = screen;
  const passed = score >= Math.ceil(lesson.questions.length / 2);
  return (
    <section className="mx-auto w-full max-w-xl pb-28 md:pb-10" dir="rtl">
      <div className="rounded-3xl border border-white/[0.08] bg-[#0d1110] p-6 text-center sm:p-9">
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${passed ? 'bg-emerald-300/10 text-emerald-200' : 'bg-amber-300/10 text-amber-200'}`}>
          {passed ? <CheckCircle2 className="h-8 w-8" /> : <GraduationCap className="h-8 w-8" />}
        </div>
        <h1 className="mt-5 text-2xl font-extrabold text-white">{passed ? 'أحسنت، أتممت الاختبار!' : 'بداية طيبة، واصل التعلّم'}</h1>
        <p className="mt-2 text-slate-300">{lesson.title}</p>
        <p className="mt-6 text-4xl font-black text-emerald-200">{score}<span className="text-2xl text-slate-500"> / {lesson.questions.length}</span></p>
        <p className="mt-2 text-sm text-slate-400">
          أفضل نتيجة محفوظة: {progress.bestQuizScores[lesson.id] ?? score} من {lesson.questions.length}
        </p>
        {!storageAvailable && <p role="status" className="mt-4 text-sm text-amber-200">تعذّر حفظ نتيجتك محلياً.</p>}
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={() => openQuiz(lesson)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-300 px-4 font-bold text-emerald-950 hover:bg-emerald-200">
            <RotateCcw className="h-4 w-4" /> أعد الاختبار
          </button>
          <button type="button" onClick={() => setScreen({ type: 'catalog' })} className="min-h-12 rounded-xl border border-white/10 px-4 font-semibold text-slate-200 hover:bg-white/5">
            العودة إلى الدروس
          </button>
        </div>
      </div>
    </section>
  );
}

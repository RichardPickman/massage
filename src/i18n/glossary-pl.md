# Polish glossary (i18n)

Review this table before the copy spreads across the app. Wording here is the
decision; a later diff only applies it. New rows are appended per ticket.

Rules of the house:

-   **Testy**, not _Quizy_ — the group calls them «тесты», and the Polish word is
    `test`.
-   **Wykład** for a lecture, **slajd** for a slide, **pytanie** for a question,
    **odpowiedź** for an answer.
-   **Prowadzący** for the lecturer (`Teacher`), **Dzień wykładu** for `Lecture
day` — it is a day, not a date, and the field is optional.
-   Buttons name the action: `Zapisz`, `Wyczyść`, `Wyloguj`. No `OK`.
-   Plural forms come from i18next (`_one`, `_few`, `_many`): the counters read
    `1 pytanie`, `2 pytania`, `5 pytań`.

## Shell (ticket 01)

| Key                     | English            | Polish             |
| ----------------------- | ------------------ | ------------------ |
| `common.language`       | Language           | Język              |
| `nav.primary`           | Primary navigation | Nawigacja główna   |
| `nav.main`              | Main navigation    | Nawigacja główna   |
| `nav.home`              | Home               | Strona główna      |
| `nav.overview`          | Overview           | Przegląd           |
| `nav.lectures`          | Lectures           | Wykłady            |
| `nav.quizzes`           | Quizzes            | Testy              |
| `auth.signIn`           | Sign in            | Zaloguj się        |
| `account.menu`          | Account            | Konto              |
| `account.openAccount`   | Open account menu  | Otwórz menu konta  |
| `account.signedInAs`    | Signed in as       | Zalogowany jako    |
| `account.inviteCodes`   | Invite codes       | Kody zaproszeń     |
| `account.statsOverview` | Stats overview     | Przegląd statystyk |
| `account.logOut`        | Log out            | Wyloguj            |

## Lectures (ticket 02)

| Key                            | English                                     | Polish                                       |
| ------------------------------ | ------------------------------------------- | -------------------------------------------- |
| `lectures.title`               | Lectures                                    | Wykłady                                      |
| `lectures.description`         | Image slides, grouped by session.           | Slajdy z wykładów, pogrupowane według zajęć. |
| `lectures.add`                 | Add lecture                                 | Dodaj wykład                                 |
| `lectures.empty`               | There are no lectures yet.                  | Nie ma jeszcze żadnych wykładów.             |
| `lectures.columns.topic`       | Topic                                       | Temat                                        |
| `lectures.columns.lesson`      | Lesson                                      | Zajęcia                                      |
| `lectures.columns.teacher`     | Teacher                                     | Prowadzący                                   |
| `lectures.columns.date`        | Date                                        | Data                                         |
| `lectures.columns.actions`     | Actions                                     | Akcje                                        |
| `lectures.backAll`             | All lectures                                | Wszystkie wykłady                            |
| `lectures.removeTitle`         | Remove lecture?                             | Usunąć wykład?                               |
| `lectures.removeFailed`        | Lecture was not removed                     | Nie udało się usunąć wykładu                 |
| `lectures.viewer.empty`        | This lecture has no images.                 | Ten wykład nie ma zdjęć.                     |
| `lectures.form.topic`          | Topic                                       | Temat                                        |
| `lectures.form.lesson`         | Lesson                                      | Zajęcia                                      |
| `lectures.form.teacher`        | Teacher                                     | Prowadzący                                   |
| `lectures.form.date`           | Lecture day                                 | Dzień wykładu                                |
| `lectures.form.optional`       | Optional                                    | Opcjonalnie                                  |
| `lectures.form.upload`         | Upload images                               | Dodaj zdjęcia                                |
| `lectures.form.checkFields`    | Check the highlighted fields before saving. | Popraw zaznaczone pola przed zapisaniem.     |
| `common.save` / `common.clear` | Save / Clear                                | Zapisz / Wyczyść                             |
| `common.pageOf`                | Page {{page}} of {{pages}}                  | Strona {{page}} z {{pages}}                  |

## Quizzes, quiz screen and result (ticket 03)

| Key                           | English                                                   | Polish                                                           |
| ----------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------- |
| `quizzes.title`               | Quizzes                                                   | Testy                                                            |
| `quizzes.description`         | Scored tests. Every attempt lands on your record.         | Testy punktowane. Każde podejście trafia do Twojego rejestru.    |
| `quizzes.add`                 | Add quiz                                                  | Dodaj test                                                       |
| `quizzes.backAll`             | All tests                                                 | Wszystkie testy                                                  |
| `quizzes.questions`           | 1 question / 2 questions                                  | 1 pytanie / 2 pytania / 5 pytań                                  |
| `quizzes.removeTitle`         | Remove quiz?                                              | Usunąć test?                                                     |
| `quizzes.emptyQuestions`      | This quiz has no questions yet.                           | Ten test nie ma jeszcze pytań.                                   |
| `quiz.questionOf`             | Question {{current}} of {{total}}                         | Pytanie {{current}} z {{total}}                                  |
| `quiz.previous` / `quiz.next` | Previous / Next                                           | Poprzednie / Następne                                            |
| `quiz.finish`                 | Finish test                                               | Zakończ test                                                     |
| `result.kicker`               | Result                                                    | Wynik                                                            |
| `result.score`                | You've got {{correct}} of {{total}} right ({{percent}}%)  | Poprawnie {{correct}} z {{total}} ({{percent}}%)                 |
| `result.passed` / `notPassed` | Passed / Not passed                                       | Zaliczony / Niezaliczony                                         |
| `result.passMark`             | Pass mark {{threshold}}%                                  | Próg zaliczenia {{threshold}}%                                   |
| `result.attempt`              | Attempt {{count}} · best {{best}}% · average {{average}}% | Podejście {{count}} · najlepszy {{best}}% · średnia {{average}}% |
| `result.unfold` / `fold`      | Unfold / Fold                                             | Rozwiń / Zwiń                                                    |
| `result.restart`              | Restart                                                   | Od nowa                                                          |
| `result.showWrong`            | Show wrong answers                                        | Pokaż błędne odpowiedzi                                          |

Note: `Wynik` for the result screen, `Zaliczony / Niezaliczony` for the verdict —
not `Zdane / Niezdane`, which is the school register's language, not the app's.

## Auth screens (ticket 04)

| Key                      | English                                                                    | Polish                                                           |
| ------------------------ | -------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `auth.signInTitle`       | Sign In                                                                    | Zaloguj się                                                      |
| `auth.signUpTitle`       | Sign Up                                                                    | Utwórz konto                                                     |
| `auth.welcomeBack`       | Welcome back. Your test record is waiting.                                 | Witaj ponownie. Twój rejestr testów czeka.                       |
| `auth.createWithInvite`  | Create an account with the invite code you were sent.                      | Utwórz konto, używając kodu zaproszenia, który otrzymałeś.       |
| `auth.couldNotSignIn`    | Could not sign in                                                          | Nie udało się zalogować                                          |
| `auth.couldNotCreate`    | Could not create the account                                               | Nie udało się utworzyć konta                                     |
| `auth.email`             | Email                                                                      | E-mail                                                           |
| `auth.password`          | Password                                                                   | Hasło                                                            |
| `auth.inviteCode`        | Invite code                                                                | Kod zaproszenia                                                  |
| `auth.inviteHint`        | Issued for this exact email address, so it will not work with another one. | Wydany na dokładnie ten adres e-mail, więc nie zadziała z innym. |
| `auth.submitting`        | Submitting...                                                              | Wysyłanie...                                                     |
| `auth.createAccount`     | Create account                                                             | Utwórz konto                                                     |
| `auth.needAccount`       | Need an account?                                                           | Nie masz konta?                                                  |
| `auth.alreadyRegistered` | Already registered?                                                        | Masz już konto?                                                  |

The card takes `mode="signIn" | "signUp"`, not the heading: the heading is copy and
changes with the language, so it must not decide whether a code is asked for.

## Stats and the signed-out hero (ticket 04)

| Key                         | English                        | Polish                                |
| --------------------------- | ------------------------------ | ------------------------------------- |
| `stats.kicker`              | Overview                       | Przegląd                              |
| `stats.title`               | Your test record               | Twój rejestr testów                   |
| `stats.lastAttempt`         | Last attempt {{date}}          | Ostatnie podejście {{date}}           |
| `stats.staleTitle`          | This record may be out of date | Ten rejestr może być nieaktualny      |
| `stats.refresh`             | Refresh                        | Odśwież                               |
| `stats.byTest.title`        | By test                        | Według testów                         |
| `stats.columns.test`        | Test                           | Test                                  |
| `stats.columns.attempts`    | Attempts                       | Podejścia                             |
| `stats.columns.best`        | Best                           | Najlepszy                             |
| `stats.columns.average`     | Average                        | Średni                                |
| `stats.columns.last`        | Last                           | Ostatni                               |
| `stats.columns.trend`       | Trend                          | Trend                                 |
| `stats.removed`             | Removed                        | Usunięty                              |
| `stats.attempt`             | 1 attempt / 2 attempts         | 1 podejście / 2 podejścia / 5 podejść |
| `stats.openQuiz`            | Open {{title}}                 | Otwórz {{title}}                      |
| `stats.scoreTrend`          | {{title}} score trend          | Trend wyników: {{title}}              |
| `stats.empty.title`         | No attempts on record          | Brak podejść w rejestrze              |
| `stats.error.title`         | Stats unavailable              | Statystyki niedostępne                |
| `stats.error.retry`         | Try again                      | Spróbuj ponownie                      |
| `stats.skeleton.loading`    | Loading your stats...          | Ładowanie statystyk...                |
| `stats.hero.titleLead`      | Learn the body.                | Poznaj ciało.                         |
| `stats.hero.titleAccent`    | Prove you know it.             | Udowodnij, że to umiesz.              |
| `stats.hero.takeTest`       | Take a test                    | Rozwiąż test                          |
| `stats.hero.browseLectures` | Browse lectures                | Przeglądaj wykłady                    |
| `stats.hero.cardTitle`      | How the record works           | Jak działa rejestr                    |

`Podejście` is the attempt, `Rejestr` the record, `Najlepszy / Średni / Ostatni
wynik` the three columns — not `Najlepszy wynik / Średnia / Ostatnio`.

## Admin invite codes (ticket 04)

| Key                          | English                                                                                             | Polish                                                                                             |
| ---------------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `admin.title`                | Invite codes                                                                                        | Kody zaproszeń                                                                                     |
| `admin.description`          | Mint the code for one person's address, then send it to them. The code only works for that address. | Wygeneruj kod dla adresu jednej osoby i wyślij go jej. Kod działa tylko z tym adresem.             |
| `admin.email`                | Their email                                                                                         | E-mail osoby zapraszanej                                                                           |
| `admin.submit`               | Get the code                                                                                        | Pobierz kod                                                                                        |
| `admin.minting`              | Minting...                                                                                          | Generowanie...                                                                                     |
| `admin.errorTitle`           | Could not mint a code                                                                               | Nie udało się wygenerować kodu                                                                     |
| `admin.codeFor`              | Code for {{email}}                                                                                  | Kod dla {{email}}                                                                                  |
| `admin.copy`                 | Copy the code                                                                                       | Kopiuj kod                                                                                         |
| `admin.copied`               | Copied                                                                                              | Skopiowano                                                                                         |
| `admin.noAccess.title`       | Not your area                                                                                       | To nie Twoja część                                                                                 |
| `admin.noAccess.description` | Invite codes are minted by the site's admin. Your account can read lectures and take tests.         | Kody zaproszeń generuje administrator strony. Twoje konto może czytać wykłady i rozwiązywać testy. |
| `admin.noAccess.body`        | If you were expecting access, ask whoever invited you.                                              | Jeśli spodziewałeś się dostępu, zapytaj osobę, która Cię zaprosiła.                                |

`Kod zaproszenia` is the code itself, `Kody zaproszeń` the panel. The button is
`Pobierz kod` (the action), never `OK`.

## Quiz constructor (ticket 04)

| Key                                  | English                                              | Polish                                                      |
| ------------------------------------ | ---------------------------------------------------- | ----------------------------------------------------------- |
| `constructor.kicker`                 | Editor                                               | Edytor                                                      |
| `constructor.title`                  | Quiz constructor                                     | Kreator testu                                               |
| `constructor.save`                   | Save quiz                                            | Zapisz test                                                 |
| `constructor.openQuiz`               | Open quiz                                            | Otwórz test                                                 |
| `constructor.checkFields`            | Check the highlighted fields before saving           | Popraw zaznaczone pola przed zapisaniem                     |
| `constructor.addQuestionRequired`    | Add at least one question                            | Dodaj co najmniej jedno pytanie                             |
| `constructor.draft.title`            | Unsaved draft from {{date}}                          | Niezapisany szkic z {{date}}                                |
| `constructor.draft.restore`          | Restore draft                                        | Przywróć szkic                                              |
| `constructor.draft.fresh`            | Start fresh                                          | Zacznij od nowa                                             |
| `constructor.field.title`            | Quiz title                                           | Tytuł testu                                                 |
| `constructor.field.titleRequired`    | Quiz title cannot be empty                           | Tytuł testu nie może być pusty                              |
| `constructor.field.threshold`        | Pass threshold, %                                    | Próg zaliczenia, %                                          |
| `constructor.field.thresholdHint`    | Students need at least this score to pass.           | Aby zdać, student musi mieć co najmniej tyle procent.       |
| `constructor.questions.heading`      | Questions                                            | Pytania                                                     |
| `constructor.addQuestion`            | Add question                                         | Dodaj pytanie                                               |
| `constructor.card.question`          | Question {{number}}                                  | Pytanie {{number}}                                          |
| `constructor.card.needsAttention`    | Needs attention                                      | Wymaga poprawy                                              |
| `constructor.card.edit`              | Edit                                                 | Edytuj                                                      |
| `constructor.card.preview`           | Preview question {{number}}                          | Podejrzyj pytanie {{number}}                                |
| `constructor.card.delete`            | Delete question {{number}}                           | Usuń pytanie {{number}}                                     |
| `constructor.form.question`          | Question                                             | Pytanie                                                     |
| `constructor.form.answer`            | Answer {{number}}                                    | Odpowiedź {{number}}                                        |
| `constructor.form.answerCorrect`     | Answer {{number}} is correct                         | Odpowiedź {{number}} jest poprawna                          |
| `constructor.form.answerRemove`      | Remove answer {{number}}                             | Usuń odpowiedź {{number}}                                   |
| `constructor.form.answerPlaceholder` | Answer text                                          | Treść odpowiedzi                                            |
| `constructor.form.answersHint`       | Two to {{max}} answers, at least one marked correct. | Od dwóch do {{max}} odpowiedzi, co najmniej jedna poprawna. |
| `constructor.problems.text`          | Add the question text                                | Dodaj treść pytania                                         |
| `constructor.problems.minAnswers`    | Fill at least {{count}} answers                      | Uzupełnij co najmniej {{count}} odpowiedzi                  |
| `constructor.problems.minCorrect`    | Mark at least one correct answer                     | Zaznacz co najmniej jedną poprawną odpowiedź                |
| `constructor.problems.maxAnswers`    | No more than {{count}} answers                       | Nie więcej niż {{count}} odpowiedzi                         |
| `constructor.threshold.number`       | Threshold must be a number                           | Próg musi być liczbą                                        |
| `constructor.threshold.whole`        | Threshold must be a whole number                     | Próg musi być liczbą całkowitą                              |
| `constructor.threshold.range`        | Threshold must be between 0 and 100                  | Próg musi mieścić się między 0 a 100                        |

`Kreator testu` for the constructor, `Szkic` for the draft, `Próg zaliczenia` for
the pass mark. Validation problems travel from the helper as codes, not
sentences, so a card that was open across a language switch re-renders in the new
language.

## Error page and shared components (ticket 04)

| Key                         | English                                        | Polish                                          |
| --------------------------- | ---------------------------------------------- | ----------------------------------------------- |
| `error.title`               | Something went wrong                           | Coś poszło nie tak                              |
| `error.description`         | This page could not be rendered.               | Nie udało się wyświetlić tej strony.            |
| `error.back`                | Back to overview                               | Wróć do przeglądu                               |
| `error.reload`              | Reload                                         | Odśwież                                         |
| `common.open`               | Open                                           | Otwórz                                          |
| `common.closeAlert`         | Close alert                                    | Zamknij powiadomienie                           |
| `common.questionImage`      | Question image                                 | Zdjęcie pytania                                 |
| `upload.dropHint`           | Drop an image here, or choose a file           | Przeciągnij zdjęcie tutaj lub wybierz plik      |
| `upload.pick`               | Upload image                                   | Dodaj zdjęcie                                   |
| `upload.remove`             | Remove image                                   | Usuń zdjęcie                                    |
| `upload.notImage`           | Only image files can be attached to a question | Do pytania można dołączyć tylko pliki graficzne |
| `upload.tooLarge`           | Image is larger than 10 MB                     | Zdjęcie jest większe niż 10 MB                  |
| `upload.unnamedFile`        | File unnamed                                   | Plik bez nazwy                                  |
| `lectures.openLecture`      | Open lecture                                   | Otwórz wykład                                   |
| `lectures.form.removeImage` | Remove {{name}}                                | Usuń {{name}}                                   |

Deliberately left in English: email and invite-code placeholders
(`you@example.com`, `friend@example.com`, `XXXX-XXXX-XXXX-XXXX`, `••••••••`), the
brand marks (`RP`, `Massage`), and the `Deleted quiz` server sentinel compared in
`stats/helpers.ts` — that one is data, and translating it would break the match.

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

| Key | English | Polish |
|---|---|---|
| `lectures.title` | Lectures | Wykłady |
| `lectures.description` | Image slides, grouped by session. | Slajdy z wykładów, pogrupowane według zajęć. |
| `lectures.add` | Add lecture | Dodaj wykład |
| `lectures.empty` | There are no lectures yet. | Nie ma jeszcze żadnych wykładów. |
| `lectures.columns.topic` | Topic | Temat |
| `lectures.columns.lesson` | Lesson | Zajęcia |
| `lectures.columns.teacher` | Teacher | Prowadzący |
| `lectures.columns.date` | Date | Data |
| `lectures.columns.actions` | Actions | Akcje |
| `lectures.backAll` | All lectures | Wszystkie wykłady |
| `lectures.removeTitle` | Remove lecture? | Usunąć wykład? |
| `lectures.removeFailed` | Lecture was not removed | Nie udało się usunąć wykładu |
| `lectures.viewer.empty` | This lecture has no images. | Ten wykład nie ma zdjęć. |
| `lectures.form.topic` | Topic | Temat |
| `lectures.form.lesson` | Lesson | Zajęcia |
| `lectures.form.teacher` | Teacher | Prowadzący |
| `lectures.form.date` | Lecture day | Dzień wykładu |
| `lectures.form.optional` | Optional | Opcjonalnie |
| `lectures.form.upload` | Upload images | Dodaj zdjęcia |
| `lectures.form.checkFields` | Check the highlighted fields before saving. | Popraw zaznaczone pola przed zapisaniem. |
| `common.save` / `common.clear` | Save / Clear | Zapisz / Wyczyść |
| `common.pageOf` | Page {{page}} of {{pages}} | Strona {{page}} z {{pages}} |

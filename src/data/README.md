# Data Guide

This folder contains all exam data. **No code here — only JSON files.**

The app auto-discovers everything. Add a folder → it shows up.

---

## Structure

```
data/
  classes.json              ← list of courses (rarely changes)
  <class_id>/
    <number>/
      info.json             ← metadata (type field determines exam vs project)
      body.json             ← questions & answers       [exam only]
      students.json         ← per-student grades        [exam only]
      groups.json           ← group list with members   [project only]
```

Example:
```
data/
  os/00/   ← OS exam    (info + body + students)
  os/01/   ← OS exam    (info + body + students)
  os/02/   ← OS project (info + groups)
  cpp/00/  ← C++ exam
  cpp/03/  ← C++ project
```

The `type` field in `info.json` controls which files are expected:
- No `type` (or omitted) → exam: needs `body.json` + `students.json`
- `"type": "project"` → project: needs `groups.json`

---

## Adding a new exam (step by step)

### 1. Create the folder

```bash
mkdir -p src/data/os/01
```

Use the class id (`os`, `net`, `fp`) and the next number (`01`, `02`...).

### 2. Create `info.json`

```json
{
  "title": "Operating Systems – Final Exam",
  "date": "2026-06-15",
  "publishedDate": "2026-06-18",
  "totalPoints": 100,
  "coeff": 40
}
```

| Field           | Description                                      |
|-----------------|--------------------------------------------------|
| `title`         | Display name shown to students                   |
| `date`          | When the exam took place (YYYY-MM-DD)            |
| `publishedDate` | When results go live — **controls default tab**   |
| `totalPoints`   | Total points (always 100 for now)                |
| `coeff`         | Weight as a percentage (10 = 10% of final grade) |

### 3. Create `body.json`

```json
{
  "bodyType": "mcq",
  "questions": [
    {
      "id": 1,
      "text": "What is a process?",
      "options": {
        "A": "A file on disk",
        "B": "A program in execution",
        "C": "A CPU register",
        "D": "A kernel module"
      },
      "correct": ["B"],
      "mode": "any",
      "explanation": "A process is a program that has been loaded into memory and is being executed by the CPU."
    },
    {
      "id": 2,
      "text": "Which are valid IPC mechanisms?",
      "options": {
        "A": "Pipes",
        "B": "Shared memory",
        "C": "USB",
        "D": "Sockets"
      },
      "correct": ["A", "B", "D"],
      "mode": "all",
      "explanation": "Pipes, shared memory, and sockets are IPC mechanisms. USB is a hardware interface."
    }
  ]
}
```

| Field             | Description                                                |
|-------------------|------------------------------------------------------------|
| `bodyType`        | Always `"mcq"` for now. Future: `"open"`, `"code"`, etc.  |
| `questions[].id`  | Unique number within this exam (1, 2, 3...)                |
| `questions[].text`| The question text                                          |
| `questions[].options` | Object with letter keys: `{ "A": "...", "B": "..." }`|
| `questions[].correct` | Array of correct letter(s): `["B"]` or `["A", "D"]`  |
| `questions[].mode`    | `"any"` = pick one correct, `"all"` = pick all correct|
| `questions[].explanation` | Why the answer is correct (shown to students) — see **Explanation style guide** below |

**Scoring rules:**
- `mode: "any"` → student picks **one** answer. If it's in `correct`, full points.
- `mode: "all"` → student must pick a **subset** of correct answers. Partial credit = (correct picks / total correct). **Any wrong pick = 0 points.**

**Explanation style guide:**

Explanations are rendered with Markdown (inline `code`, **bold**, `\n` line breaks, `- ` bullet lists, and ` ```cpp ` code blocks). Write them like a short course snippet — clear, breathable, educational.

Rules:
- **Simple English.** Students are non-native speakers. Use short sentences. Avoid idioms and complex grammar. Technical keywords (`dangling pointer`, `undefined behavior`, `pass by value`…) stay exact — don't simplify those.
- **Breathe.** Never write a wall of text. Use line breaks between ideas. Use bullet lists for steps or key points.
- **Structure.** For "what is the output?" → trace step by step with bullets. For concepts → state the rule, then show why it matters.
- **Code examples.** Add a short `cpp` code block when it helps: to show the fix, the safe pattern, or the contrast. Keep it to 2–4 lines.
- **Bold** the key concept or takeaway once (e.g., `**pass by value**`, `**dangling pointer**`).

Example:

```
"explanation": "This is **pass by value** — the function gets a copy, not the original.\n\nStep by step:\n- `n = 4` in `main()`\n- `triple(n)` sends a copy of `4`\n- Inside the function, only the copy changes\n- `n` stays `4`\n\nTo change the original, use a reference:\n```cpp\nvoid triple(int& x) { x = x * 3; }\n```"
```

### 4. Create `students.json`

**Grade is always required.** The `wrong` field is optional — adds question-level detail.

#### Detailed mode (recommended — shows question-by-question review)

Only list **wrong** answers. Questions not listed = student got it right.

```json
{
  "20230001": {
    "name": "Zhang Wei",
    "grade": 100,
    "wrong": {}
  },
  "20230002": {
    "name": "Li Ming",
    "grade": 40,
    "wrong": {
      "1": "A",
      "3": "ABC",
      "5": "D"
    }
  }
}
```

- Keys in `wrong` are **question IDs as strings** (`"1"`, `"2"`, etc.)
- Values are what the student **actually picked** (letters concatenated: `"A"`, `"AC"`, `"ABD"`)
- Empty `wrong: {}` = perfect score

#### Simple mode (grade only)

```json
{
  "20230001": {
    "name": "Zhang Wei",
    "grade": 85
  }
}
```

Students without `wrong` can't click into exam details — they see their grade only.

---

---

## Adding a project

### 1. Create the folder

Use the next available number in the class directory:

```bash
mkdir -p src/data/os/02
```

### 2. Create `info.json`

```json
{
  "type": "project",
  "title": "System Call Implementation",
  "startDate": "2026-03-15",
  "deadline": "2026-05-01",
  "totalPoints": 100,
  "coeff": 30
}
```

| Field         | Description                                                  |
|---------------|--------------------------------------------------------------|
| `type`        | Must be `"project"` — tells the loader which files to expect |
| `title`       | Display name shown to all students                           |
| `startDate`   | Project start date (YYYY-MM-DD)                              |
| `deadline`    | Submission deadline (YYYY-MM-DD)                             |
| `totalPoints` | Max score (default 100)                                      |
| `coeff`       | Weight as a percentage in the final grade                    |

### 3. Create `groups.json`

Each entry is one group. Grade and comments start as `null` and are filled in after evaluation.

```json
[
  {
    "groupName": "team-alpha",
    "repositoryLink": "https://github.com/student/team-alpha",
    "grade": null,
    "comments": null,
    "members": {
      "2023905317": "李定诺",
      "2023903690": "喻思翔"
    }
  },
  {
    "groupName": "team-beta",
    "repositoryLink": null,
    "grade": null,
    "comments": null,
    "members": {
      "2023901234": "张三",
      "2023901235": "李四"
    }
  }
]
```

| Field            | Description                                          |
|------------------|------------------------------------------------------|
| `groupName`      | Team name (shown as a badge) — use the repo name    |
| `repositoryLink` | URL to the repo, or `null` if not provided           |
| `grade`          | `null` until graded, then a number (e.g. `87.5`)    |
| `comments`       | `null` until reviewed, then a feedback string        |
| `members`        | Object mapping student IDs → names                  |

### 4. Grading later

When a group's project is graded, edit their entry in `groups.json`:

```json
{
  "grade": 87.5,
  "comments": "Good work overall. Memory management needs improvement.",
  ...
}
```

Each group can be graded independently. The project card updates automatically.

---

## Adding a new class

1. Edit `classes.json`:

```json
[
  { "id": "net", "label": "Net", "fullName": "Networking" },
  { "id": "os", "label": "OS", "fullName": "Operating Systems" },
  { "id": "fp", "label": "FP", "fullName": "Functional Programming" },
  { "id": "db", "label": "DB", "fullName": "Databases" }
]
```

2. Create the folder: `mkdir src/data/db`
3. Add exams inside it: `mkdir src/data/db/00` + the three JSON files

---

## Converting your Markdown exam to JSON with AI

If your exam is already written in Markdown, use this prompt to convert it:

```
Convert the following exam to two JSON files.

FILE 1 — info.json:
{
  "title": "<exam name>",
  "date": "<exam date YYYY-MM-DD>",
  "publishedDate": "<today YYYY-MM-DD>",
  "totalPoints": 100,
  "coeff": <percentage, e.g. 10 = 10%>
}

FILE 2 — body.json:
{
  "bodyType": "mcq",
  "questions": [
    {
      "id": <number starting from 1>,
      "text": "<question text>",
      "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "correct": ["<letter(s)>"],
      "mode": "any" or "all",
      "explanation": "<generate an educational explanation of why the correct answer is correct>"
    }
  ]
}

Rules:
- Default mode to "any" (single correct answer) unless I say otherwise
- Generate clear, educational explanations for each question
- Keep option letters matching the original exam

Here is my exam:
<paste your markdown here>
```

---

## Converting your graded papers to students.json

After grading paper MCQs, fill a CSV like this:

```csv
student_id, name, q1, q2, q3, q4, q5
20230001, Zhang Wei, C, B, AB, B, B
20230002, Li Ming, A, B, A, B, D
```

Then use this prompt:

```
Convert this CSV of student answers into students.json format.

The correct answers for each question are:
Q1: C
Q2: B
Q3: A,B (mode: all)
Q4: B
Q5: B

Generate a JSON where each student has:
- "name": their name
- "wrong": an object where keys are question IDs (as strings)
  and values are the student's wrong answer (letters concatenated).
  Only include questions where the student got it wrong.
  If the student got everything right, use "wrong": {}

CSV:
<paste your CSV here>
```

---

## Quick checklist for adding an exam

- [ ] Create folder: `data/<class>/<number>/`
- [ ] Create `info.json` with title, dates, points, coeff
- [ ] Create `body.json` with bodyType and questions array
- [ ] Create `students.json` with student results (detailed or simple)
- [ ] Run `npm run dev` — exam appears automatically

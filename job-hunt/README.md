# Job Hunt Kit

A Claude Code job-search system for **full-time remote or on-site roles**.

Built by taking the [@VermaAakash3 six-step thread](https://x.com/VermaAakash3/status/2084938125705671066)
and fixing the three things that stop it from working, then adding the half of the funnel it
leaves out.

---

## Where this came from, and what changed

The source thread is one Claude prompt split into six numbered sub-asks:

1. Find 10 founder communities with join URLs + hiring channels + a recent gig from each
2. LinkedIn boolean + post filters to surface unlisted gigs, plus a 3-part outreach sequence
3. Open-source projects that'd welcome freelance help + maintainer contact + a pitch
4. 15 fresh founder posts saying "need help" / "hiring contract" + a custom DM opener each
5. Wellfound scan for freshly funded small teams + founder contact + a 50-word pitch
6. A referral engine + 3 outreach messages + a way to track it

The core insight is right and worth keeping: **most hiring conversations start before a job
posting exists**, and the people who get hired fast are the ones talking to hiring managers
in the window between "we need someone" and "we posted the req." Everything here preserves
that. But as written the thread has three problems and one large gap.

### Problem 1 — it hunts the wrong market for you

Every step is freelance-shaped: "freelance/contract gig," "contract help," "freelance
backup," "hands-on early-stage support." You want full-time. Freelance sourcing and
full-time sourcing overlap maybe 40%; the rest actively wastes your time. A founder who
wants 10 hours a week of contract help is not a full-time req, and pitching yourself as
available for project work is a positioning problem you then have to undo.

Every prompt in `prompts/` is rewritten for full-time hiring signals: headcount posts,
"we're growing the team," fresh funding rounds (which convert to full-time reqs on a
predictable lag), careers-page diffs, and hiring managers rather than founders once the
company is past ~50 people. Contract-to-hire is kept as an explicit on-ramp where it's a
real path, and flagged as such rather than blurred in.

### Problem 2 — it asks a language model to invent URLs and contact details

"Provide the invite/join URL." "Capture founder contact info." "Drop the link." Asked cold,
a model produces plausible, well-formatted, non-existent Discord invites and personal email
addresses. You then spend your first week bouncing off dead links, which reads as the method
failing when it's the prompt failing.

Every prompt here carries a **verification gate**: the model must search the live web, must
return only URLs it actually retrieved, must state where each fact came from, and must label
anything it couldn't confirm as `UNVERIFIED` instead of dropping it or guessing. A short list
of real links beats a long list of fabricated ones, and the prompts say so explicitly.

### Problem 3 — no `[insert your skill]`, over and over

The thread makes you hand-paste your background into six separate prompts, so the outputs
drift and the outreach copy is generic. Here you fill in `profile.md` **once** and every
prompt reads from it. That single file is also what makes the personalization in
`prompts/09-outreach-personalize.md` possible at all.

### The gap — the thread stops at "sent a DM"

Six steps of sourcing, zero steps of conversion. Sourcing is the easy half. Nobody's bottleneck
is finding companies; it's getting from contact to offer. Added:

| Prompt | Fills |
|---|---|
| `07-resume-tailor.md` | Per-role tailoring against the actual posting, from your real history |
| `08-ats-gap-check.md` | Why you're being filtered before a human reads it |
| `09-outreach-personalize.md` | Turns a template into something that gets a reply |
| `10-interview-prep.md` | Company-specific prep, your weak spots, questions to ask |
| `11-negotiation.md` | The step with the highest hourly return in the whole search |

Also added: a 30-day cadence (`30-day-plan.md`), because "hired in 30 days max" with no daily
plan is a headline, not a method — and a pipeline tracker, because by week two you will not
remember who you contacted.

### One more thing the thread gets wrong

It tells you to join founder communities and DM people about work. **Most of those communities
ban exactly that**, and the ones that don't will still mute you for it. Getting removed from
the five best Slacks in your niche in week one is a real cost with no recovery. Every
community prompt here pulls the group's actual posting rules first and routes you to the
channel where the ask is welcome, or tells you to participate for a week before asking.

---

## Setup

```bash
cp -r job-hunt ~/your-job-search    # this folder is self-contained; move it anywhere
cd ~/your-job-search
```

It lives in this repo only because this repo was the delivery mechanism. Nothing here depends
on the rest of the repo. If you want the skill active in Claude Code, copy `SKILL.md` into
`.claude/skills/job-hunt/SKILL.md` inside whatever directory you run Claude Code from.

Then:

1. **Fill in `profile.md`.** Copy `profile.template.md` to `profile.md` and answer it properly
   — this is the input to everything else, and vague answers here produce vague output
   everywhere. Twenty minutes well spent. `profile.md` is gitignored so your details stay local.
2. **Drop your existing materials in.** Put your current resume at `materials/resume.md` (or
   `.pdf` — Claude Code reads both) and anything else you've already written in `materials/`.
   The tailoring and gap-check prompts read from these instead of inventing a history for you.
3. **Run `30-day-plan.md`** and follow the cadence.

## Daily use

Open Claude Code in this folder and reference a prompt:

```
Run prompts/04-signal-scan.md
```

Claude Code reads `profile.md` and `materials/` on its own. Append results to the trackers in
`tracker/` as you go — several prompts write to them directly.

## Layout

```
job-hunt/
├── README.md                 you are here
├── SKILL.md                  drop-in Claude Code skill
├── profile.template.md       fill this in once → profile.md
├── 30-day-plan.md            the cadence
├── prompts/
│   ├── 01-communities.md         ← thread step 1, rules-aware, full-time
│   ├── 02-linkedin-hidden.md     ← thread step 2, full-time boolean
│   ├── 03-open-source.md         ← thread step 3, as a credibility play
│   ├── 04-signal-scan.md         ← thread step 4, full-time hiring signals
│   ├── 05-company-scan.md        ← thread step 5, funding→headcount lag
│   ├── 06-referral-engine.md     ← thread step 6, referrals beat everything
│   ├── 07-resume-tailor.md       new
│   ├── 08-ats-gap-check.md       new
│   ├── 09-outreach-personalize.md new
│   ├── 10-interview-prep.md      new
│   └── 11-negotiation.md         new
├── templates/
│   ├── outreach.md           message templates, annotated with why each line is there
│   └── followup.md           the follow-up sequence, which is where most replies come from
└── tracker/
    ├── pipeline.csv          companies and roles
    └── outreach-log.csv      every message sent, so follow-ups actually happen
```

## Honest expectations

The thread promises "hired in 30 days max." Treat that as marketing. Thirty days of this
cadence is enough to build a real pipeline and, in a good market with a clean profile, reach
final rounds. Signed offers in thirty days happen but are not the base rate — most full-time
processes run 3–8 weeks from first contact to offer once you're *in* them, and that clock
starts after the sourcing work here. Plan for 60–90 days to signature and be pleasantly
surprised. The part you control is pipeline volume and conversion quality, which is what this
kit is actually for.

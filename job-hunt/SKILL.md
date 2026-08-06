---
name: job-hunt
description: Run the user's job search — sourcing companies and hiring signals, tailoring the resume to a specific posting, writing and personalizing outreach, preparing for interviews, and negotiating an offer. Use when the user asks to find roles, check a job posting against their background, write outreach or a follow-up, prep for an interview, or handle a compensation conversation. Also use for pipeline questions like "who haven't I followed up with."
---

# Job Hunt

A full-time-role job search system. Sourcing prompts live in `prompts/01`–`06`, conversion
prompts in `prompts/07`–`11`.

## Always do this first

Read `profile.md` before anything else. It holds the target titles, the proof points, the
compensation floor, and the constraints. If it doesn't exist, tell the user to copy
`profile.template.md` to `profile.md` and fill it in — do not proceed by guessing at their
background or inventing accomplishments.

Read anything in `materials/` too (resume, past cover letters, portfolio copy). Those are the
user's real history; use them rather than reconstructing one.

## The rule that matters most

**Never invent a URL, a company detail, a funding round, a person, or a contact address.**

Every sourcing prompt requires live web search. When you produce a link, it must be one you
actually retrieved. When you state a fact about a company — headcount, funding, who runs
engineering — say where it came from and when. If you cannot confirm something, label it
`UNVERIFIED` and keep it in the output as a lead to check, or drop it. Do not smooth over the
gap.

This is not pedantry. A fabricated Discord invite or a wrong hiring manager name costs the user
a real opportunity and, in the outreach case, their credibility with a specific human being.
Ten verified leads are worth more than fifty plausible ones.

## Choosing a prompt

| The user wants | Prompt |
|---|---|
| Communities where hiring gets discussed | `prompts/01-communities.md` |
| Unlisted roles via LinkedIn | `prompts/02-linkedin-hidden.md` |
| Visibility and credibility through open source | `prompts/03-open-source.md` |
| Fresh hiring signals to act on today | `prompts/04-signal-scan.md` |
| Companies about to open headcount | `prompts/05-company-scan.md` |
| Warm intros instead of cold outreach | `prompts/06-referral-engine.md` |
| Resume tailored to one posting | `prompts/07-resume-tailor.md` |
| Why applications aren't getting responses | `prompts/08-ats-gap-check.md` |
| A message to an actual person | `prompts/09-outreach-personalize.md` |
| Interview prep for a specific company | `prompts/10-interview-prep.md` |
| An offer, a counter, or a comp conversation | `prompts/11-negotiation.md` |

If the request spans several, run the sourcing prompt first and offer the conversion step
after — don't chain five prompts unasked.

## Trackers

`tracker/pipeline.csv` holds companies and roles; `tracker/outreach-log.csv` holds every message
sent. Append to them whenever you produce leads or draft outreach. Before adding a company,
check whether it's already there — duplicate outreach to the same company from two angles reads
as spray-and-pray.

When asked what needs attention, read `outreach-log.csv` and surface anything sent 4+ days ago
with no reply and fewer than 3 touches. That backlog is where most replies actually come from.

## Tone for anything the user will send

Short. Specific to the recipient. No "I hope this finds you well," no "I'm passionate about your
mission," no paragraph about their Series B they already know about. One concrete reason this
person specifically, one line of relevant proof from `profile.md`, one small ask. If a sentence
would survive a find-and-replace of the company name, cut it.

Never claim experience the profile doesn't support, and never inflate a number. The user has to
defend every word of this in an interview.

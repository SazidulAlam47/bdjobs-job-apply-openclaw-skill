# BDJobs Job Apply

BDJobs Job Apply is an OpenClaw skill for automating the BDJobs workflow end to end: save a resume and profile, log in, refresh applied jobs, search fresh openings, rank the best matches, auto-apply, undo an application, and update expected salary.

## What It Stores

The skill keeps its working data in the `data/` folder:

- `resume.md` - resume text or LaTeX
- `userDetails.json` - login and profile details
- `loggedInData.json` - active auth data from BDJobs
- `appliedJobIds.json` - job IDs already applied to
- `notLikedJobIds.json` - job IDs to exclude from future suggestions
- `preferences.json` - extra filters and matching preferences
- `rawJobs.json` - raw job search output
- `suggestedJobs.json` - ranked job suggestions
- `lastApplyResult.json` - most recent apply result
- `lastUndoResult.json` - most recent undo result
- `lastSalaryUpdateResult.json` - most recent salary update result

## Requirements

- Node.js installed locally
- BDJobs username and password
- A resume in plain text or LaTeX

## Quick Start

1. Create a profile from your resume:

```bash
node scripts/init-job-profile.js "your resume text or latex"
```

2. Save your BDJobs credentials and preferences in `data/userDetails.json` and `data/preferences.json`.

3. Log in and create `data/loggedInData.json`:

```bash
node scripts/bdjobs-login.js
```

4. Refresh applied jobs:

```bash
node scripts/bdjobs-refresh-applied.js
```

5. Search, filter, and rank fresh jobs.

## Common Workflows

### Search for Fresh Jobs

The typical search flow is:

1. Refresh applied jobs from BDJobs.
2. Fetch raw search results.
3. Remove already applied and not-liked jobs.
4. Fetch job details for the remaining candidates.
5. Rank the best matches and write `data/suggestedJobs.json`.

Useful commands:

```bash
node scripts/bdjobs-search.js --keywords=engineer,automation --pages=4 --isFresher=true --jobLocation="Dhaka"
node scripts/bdjobs-fetch-jobs.js --keyword=engineer --pages=2 --isFresher=true --jobLocation="Dhaka"
node scripts/bdjobs-filter-jobs.js < raw-jobs.json
node scripts/bdjobs-job-details.js --jobId=123456
node scripts/bdjobs-rank-jobs.js < jobs-with-details.json
```

### Apply to a Job

```bash
node scripts/bdjobs-apply.js --jobId=123456
```

If the apply succeeds, the job ID is added to `data/appliedJobIds.json` and the result is saved to `data/lastApplyResult.json`.

### Undo an Application

```bash
node scripts/bdjobs-undo.js --jobId=123456
```

If the cancellation succeeds, the job ID is removed from `data/appliedJobIds.json` and the result is saved to `data/lastUndoResult.json`.

### Update Expected Salary

```bash
node scripts/bdjobs-update-salary.js --jobId=123456 --newSalary=45000
```

The response is saved to `data/lastSalaryUpdateResult.json`.

## Script Reference

- `scripts/init-job-profile.js` - write resume text into `data/resume.md`
- `scripts/bdjobs-login.js` - run username check and login, then save auth data
- `scripts/bdjobs-refresh-applied.js` - refresh `data/appliedJobIds.json`
- `scripts/bdjobs-applied.js` - print applied jobs and refresh `data/appliedJobIds.json`
- `scripts/bdjobs-search.js` - fetch raw job search results using saved profile data
- `scripts/bdjobs-fetch-jobs.js` - fetch raw jobs for a single keyword or search term
- `scripts/bdjobs-filter-jobs.js` - remove already-applied jobs from a JSON stream on stdin
- `scripts/bdjobs-job-details.js` - fetch full job details for one job ID
- `scripts/bdjobs-rank-jobs.js` - rank jobs and write the top five suggestions
- `scripts/bdjobs-apply.js` - apply to a job by ID
- `scripts/bdjobs-undo.js` - cancel an application by ID
- `scripts/bdjobs-update-salary.js` - update expected salary for an applied job
- `scripts/bdjobs-daily-run.js` - placeholder for a cron-based daily runner

## Matching Rules

The ranking flow compares the resume and preferences against:

- job title
- company name
- job description
- education requirements
- age requirement
- experience requirement
- additional requirements
- suggested skills
- job location
- job nature

## API Notes

The repository also includes a compact API reference in `references/api.md` for the BDJobs endpoints used by the scripts.

## Expected Workflow

For OpenClaw automation, the intended order is:

1. Initialize the profile.
2. Log in.
3. Refresh applied jobs.
4. Search fresh jobs.
5. Rank the best matches.
6. Apply only to the strongest candidates.

This keeps the suggestions aligned with the resume, avoids duplicates, and preserves a clear local record of each action.

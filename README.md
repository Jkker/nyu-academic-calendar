This service auto generates iCalendar & Google Calendar subscriptions for NYU's Academic Calendar


<div>
<img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/Jkker/nyu-academic-calendar?label=last%20update&style=flat-square">
<img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/Jkker/nyu-academic-calendar/Node.js%20CI?style=flat-square">
<a href="https://github.com/Jkker/nyu-academic-calendar/blob/main/LICENSE"><img alt="GitHub license" src="https://img.shields.io/github/license/Jkker/nyu-academic-calendar?style=flat-square"></a>
</div>

## Usage

### Google Calendar

<a href="https://calendar.google.com/calendar/render?cid=sktp959jhf7jdo1vc4v40mpo7r4jqckd@import.calendar.google.com" target="_blank" rel="noreferrer noopener">Click to subscribe</a>


### Manual Subscription (Google Calendar)

1. Go to <a href="https://calendar.google.com/calendar/r/settings/addbyurl" target="_blank" rel="noreferrer noopener">Add Calendar from URL</a>
2. Paste the following URL:

   ```text
   https://raw.githubusercontent.com/Jkker/nyu-academic-calendar/main/data/nyu-academic-calendar.ics
   ```

3. Click `Add Calendar`

## Development

### Clone the repository

```bash
git clone git@github.com:Jkker/nyu-academic-calendar.git
```

### Install dependencies

```bash
npm install
```

### Run Once

```bash
npm run start
```

## FAQ

### Why not using NYU's official iCal feed?

- The description field is only available in the JSON feed.
- The original feed is kinda messy - multiple-day events are separated, all-day events are buggy sometimes, etc.
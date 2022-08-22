import fetch from 'node-fetch';
import { promises as fs } from 'fs';
import ICS from 'ics';

const DEBUG = process.env.NODE_ENV === 'development';

const getEvents = async () => {
	const res = await fetch(
		'https://events.nyu.edu/live/json/events/end_date/2045-01-01/group/Academic-Calendar'
	);
	const data = await res.json();
	if (DEBUG) console.log('Fetched', data.length, 'Events');
	return data;
};

const parseEvents = async (events) => {
	const parseStartDate = (dateStr) =>
		dateStr
			.slice(0, 10)
			.split('-')
			.map((d) => parseInt(d));

	const parseEndDate = (dateStr) => {
		const date = new Date(dateStr);
		var endDate = new Date(date.getTime() + 1000 * 60 * 60 * 25);
		return [endDate.getFullYear(), endDate.getMonth() + 1, endDate.getDate()];
	};

	const toICalDatetime = (date) => date.toISOString().replace(/[-.:]/g, '').slice(0, -4) + 'Z';

	const parsedEvents = [];
	const processedIds = {};
	for (let e of events) {
		if (e.id in processedIds) continue;
		const { title, date_utc, description, url, id, tags, repeats_end, last_modified } = e;
		processedIds[id] = true;
		const parsedEvent = {
			title,
			start: parseStartDate(date_utc),
			description,
			uid: id + '',
			url,
			categories: tags,
			timestamp: toICalDatetime(new Date(last_modified * 1000)),
		};
		if (!repeats_end) {
			parsedEvent.duration = { days: 1 };
		} else {
			parsedEvent.end = parseEndDate(repeats_end);
		}
		parsedEvents.push(parsedEvent);
	}
	if (DEBUG) console.log('Parsed to', parsedEvents.length, 'Events');
	return parsedEvents;
};

const HEADER = `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
NAME:NYU Academic Calendar
X-WR-CALNAME:NYU Academic Calendar
X-WR-CALDESC:NYU Academic Calendar
X-WR-TIMEZONE:America/New_York
PRODID:Jkker/nyu-academic-calendar
METHOD:PUBLISH
X-PUBLISHED-TTL:PT1H`;

const events2ICS = async (events) => {
	const { error, value } = ICS.createEvents(events);
	if (error) console.error(error);

	return HEADER + value.slice(value.indexOf('BEGIN:VEVENT') - 1);
};

const debugWriteJSON = (data, filename) => {
	if (!DEBUG) return;
	else
		fs.writeFile(`./data/${filename}.json`, JSON.stringify(data, null, 2)).then(() => {
			console.log(`${filename} written to ./data/${filename}.json`);
		});
};

const main = async () => {
	const events = await getEvents();
	debugWriteJSON(events, 'raw-events');

	const parsedEvents = await parseEvents(events);
	debugWriteJSON(parsedEvents, 'parsed-events');

	const ics = await events2ICS(parsedEvents);

	await fs.writeFile('./nyu-academic-calendar.ics', ics);
	await fs.writeFile('./data/nyu-academic-calendar.ics', ics);
	console.log('ICS File saved');
};

main();

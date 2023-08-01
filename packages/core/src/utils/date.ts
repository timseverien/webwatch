import { isValid, parse } from 'date-fns';

class DateParseError extends Error {
	date: string;
	dateParsed?: Date;

	constructor(details: { date: string; dateParsed?: Date }) {
		super('DATE_PARSE');
		this.date = details.date;
		this.dateParsed = details.dateParsed;
	}
}

export function parseIsoDateStrict(date: string): Date {
	const parsed = new Date(date);

	if (!isValid(parsed)) {
		throw new DateParseError({
			date: date,
			dateParsed: parsed,
		});
	}

	return parsed;
}

export function tryParseDate(
	date: string,
	formats: string[],
	referenceDate: Date = new Date(),
	options: {
		locale?: Locale;
		weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
		firstWeekContainsDate?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
		useAdditionalWeekYearTokens?: boolean;
		useAdditionalDayOfYearTokens?: boolean;
	} = {},
): Date | null {
	for (const format of formats) {
		const dateParsed = parse(date, format, referenceDate, options);

		if (isValid(dateParsed)) {
			return dateParsed;
		}
	}

	return null;
}

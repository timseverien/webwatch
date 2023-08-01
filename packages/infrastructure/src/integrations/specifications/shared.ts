export class SpecificationParseError extends Error {
	constructor(
		public readonly detail: {
			reason: string;
			url: string;
		},
	) {
		super('SPECIFICATION_PARSE');
	}
}

export class SpecificationParserTestError extends Error {
	constructor(
		public readonly detail: {
			version: string;
			documentTestResult: boolean;
			yearTestResult: boolean;
		},
	) {
		super('SPECIFICATION_PARSER_TEST_ERROR');
	}
}

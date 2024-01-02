export type LocalsWithStreamInternals = {
	stream: {
		_internal: {
			components: Map<string, Promise<string>>;
		};
	};
};

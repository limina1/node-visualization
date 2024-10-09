export const networkData = [
	{
		id: 'event1',
		kind: 30040,
		next: 'event2',
		branch: 'event4'
	},
	{
		id: 'event2',
		kind: 30041,
		next: 'event3'
	},
	{
		id: 'event3',
		kind: 30041,
		next: 'event8'
	},
	{
		id: 'event4',
		kind: 30040,
		next: 'event5'
	},
	{
		id: 'event5',
		kind: 30041,
		next: 'event6'
	},
	{
		id: 'event6',
		kind: 30041,
		next: 'event7'
	},
	{
		id: 'event7',
		kind: 30041
	},
	{
		id: 'event8',
		kind: 30041,
		next: 'event9'
	},
	{
		id: 'event9',
		kind: 30041
	},
	{
		id: 'event10',
		kind: 30040,
		next: 'event11'
	},
	{
		id: 'event11',
		kind: 30041,
		next: 'event12'
	},
	{
		id: 'event12',
		kind: 30041
	}
];

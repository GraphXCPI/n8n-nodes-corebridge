import { CorebridgeExecutor } from './CorebridgeExecutor';

export class CorebridgeGoals extends CorebridgeExecutor {
	constructor() {
		super({
			displayName: 'CoreBridge Goals',
			name: 'corebridgeGoals',
			description: 'Read CoreBridge goals, comparisons, and sales monitor totals',
			domain: 'goals',
		});
	}
}

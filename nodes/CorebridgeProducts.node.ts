import { CorebridgeExecutor } from './CorebridgeExecutor';

export class CorebridgeProducts extends CorebridgeExecutor {
	constructor() {
		super({
			displayName: 'CoreBridge Products',
			name: 'corebridgeProducts',
			description: 'Manage CoreBridge order products, statuses, and quick products',
			domain: 'products',
		});
	}
}

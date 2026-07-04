import { CorebridgeExecutor } from './CorebridgeExecutor';

export class CorebridgeCustomers extends CorebridgeExecutor {
	constructor() {
		super({
			displayName: 'CoreBridge Customers',
			name: 'corebridgeCustomers',
			description: 'Manage CoreBridge customers, locations, and merge history',
			domain: 'customers',
		});
	}
}

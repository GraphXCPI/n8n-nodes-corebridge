import { CorebridgeExecutor } from './CorebridgeExecutor';

export class CorebridgeOrders extends CorebridgeExecutor {
	constructor() {
		super({
			displayName: 'CoreBridge Orders',
			name: 'corebridgeOrders',
			description: 'Search and manage CoreBridge orders, estimates, and order details',
			domain: 'orders',
		});
	}
}

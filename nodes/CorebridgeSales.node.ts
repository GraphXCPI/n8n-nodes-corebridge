import { CorebridgeExecutor } from './CorebridgeExecutor';

export class CorebridgeSales extends CorebridgeExecutor {
	constructor() {
		super({
			displayName: 'CoreBridge Sales',
			name: 'corebridgeSales',
			description: 'Retrieve CoreBridge employees, sales centers, salespersons, tax groups, and reconciliation details',
			domain: 'sales',
		});
	}
}

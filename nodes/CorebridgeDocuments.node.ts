import { CorebridgeExecutor } from './CorebridgeExecutor';

export class CorebridgeDocuments extends CorebridgeExecutor {
	constructor() {
		super({
			displayName: 'CoreBridge Documents',
			name: 'corebridgeDocuments',
			description: 'Retrieve CoreBridge statements and work order documents',
			domain: 'documents',
		});
	}
}

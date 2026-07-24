import { CorebridgeExecutor } from './CorebridgeExecutor';

export class CorebridgeRoyalty extends CorebridgeExecutor {
	constructor() {
		super({
			displayName: 'CoreBridge Royalty',
			name: 'corebridgeRoyalty',
			description: 'Read CoreBridge royalty plans and customer overrides',
			domain: 'royalty',
		});
	}
}

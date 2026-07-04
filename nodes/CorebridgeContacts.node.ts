import { CorebridgeExecutor } from './CorebridgeExecutor';

export class CorebridgeContacts extends CorebridgeExecutor {
	constructor() {
		super({
			displayName: 'CoreBridge Contacts',
			name: 'corebridgeContacts',
			description: 'Create, update, search, and retrieve CoreBridge contacts',
			domain: 'contacts',
		});
	}
}

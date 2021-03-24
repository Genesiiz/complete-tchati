import { writable } from 'svelte/store';
import { encodeHTML } from '@/helpers/sanitize.js';

function createMessages() {
	const { subscribe, set, update } = writable(["Welcome to the chat"]);

	return {
		subscribe,
    add: payload => { update(p => [...p, encodeHTML(payload)]) },
		reset: () => set([])
	};
}

export const messages = createMessages();
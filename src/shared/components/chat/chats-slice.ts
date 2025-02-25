import { Message, Question } from '@/shared/types';
import { createSlice, PayloadAction, WithSlice } from '@reduxjs/toolkit';
import { rootReducer } from '@shared/store';
import { listeners, removeListener } from 'process';

type initialStateType = {
	openedChatId: number | null;
	currentChatMessages: Message[];
	listeners: Question[];
	passiveCallBack?: (data: Message, qna: Question) => void;
};

const initialState: initialStateType = {
	openedChatId: null,
	currentChatMessages: [],
	listeners: [],
	passiveCallBack: null,
};

export const chatSessionSlice = createSlice({
	name: 'chatSessionSlice',
	initialState,
	reducers: {
		setChatSession: (state, action) => {
			const id = action.payload.id;
			const messages = action.payload.messages;
			state.openedChatId = id;
			state.currentChatMessages = messages;
		},
		setChatSessionId: (state, action) => {
			const id = action.payload;
			state.openedChatId = id;
		},
		closeChatSession: (state) => {
			state.openedChatId = null;
			state.currentChatMessages = [];
		},
		addChatMessages: (state, action) => {
			state.currentChatMessages.push(action.payload);
		},
		addChatListener: (state, action: PayloadAction<Question>) => {
			const index = state.listeners.findIndex(
				(item) => item.id === action.payload.id
			);
			if (index < 0) {
				state.listeners.push(action.payload);
			}
		},
		removeChatListener: (state, action: PayloadAction<Question>) => {
			const index = state.listeners.findIndex(
				(item) => item.id === action.payload.id
			);
			if (index > -1) {
				state.listeners.splice(index, 1);
			}
		},
		setChatListeners: (state, action: PayloadAction<Question[]>) => {
			state.listeners = action.payload;
		},
		addChatListeners: (state, action: PayloadAction<Question[]>) => {
			state.listeners = state.listeners.concat(action.payload);
		},
		clearChatListeners: (state) => {
			state.listeners = initialState.listeners;
		},
		setPassiveChatCallback: (state, action) => {
			state.passiveCallBack = action.payload;
		},
	},
	selectors: {
		selectOpenedChatId: (state) => state.openedChatId,
		selectCurrentChatMessages: (state) => state.currentChatMessages,
		selectChatListeners: (state) => state.listeners,
		selectPassiveChatCallback: (state) => state.passiveCallBack,
	},
});

rootReducer.inject(chatSessionSlice);
const injectedSlice = chatSessionSlice.injectInto(rootReducer);
declare module '@shared/store' {
	export interface LazyLoadedSlices
		extends WithSlice<typeof chatSessionSlice> {}
}

export const {
	setChatSession,
	setChatSessionId,
	addChatMessages,
	closeChatSession,
	addChatListener,
	addChatListeners,
	setChatListeners,
	removeChatListener,
	clearChatListeners,
	setPassiveChatCallback,
} = chatSessionSlice.actions;

export const {
	selectOpenedChatId,
	selectCurrentChatMessages,
	selectChatListeners,
	selectPassiveChatCallback,
} = injectedSlice.selectors;

export default chatSessionSlice.reducer;

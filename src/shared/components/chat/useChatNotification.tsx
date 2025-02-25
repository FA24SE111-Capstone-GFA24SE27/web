import { useSocket } from '@/shared/context';
import { Message, Question } from '@/shared/types';
import { selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import React, { useEffect } from 'react';
import {
	addChatListeners,
	chatSessionSlice,
	clearChatListeners,
	removeChatListener,
	selectChatListeners,
	selectOpenedChatId,
	setChatListeners,
	setPassiveChatCallback,
} from './chats-slice';
import { closeSnackbar, enqueueSnackbar } from 'notistack';
import ChatNotificationTemplate from './ChatNotificationTemplate';
import { studentQnasApi } from '@/features/students/services/qna/qna-api';
import { counselorQnaApi } from '@/features/counselors/qna/qna-api';
import { chatApi } from './chat-api';

const useChatNotification = (qnaList: any) => {
	const socket = useSocket();
	const dispatch = useAppDispatch();
	const chatListeners = useAppSelector(selectChatListeners);

	// if(!qnaList) return;

	console.log(`🎁`, qnaList)

	useEffect(() => {
		if (socket && qnaList?.length) {
			const cb = (data: Message, qna: Question) => {
				enqueueSnackbar(data.content, {
					key: data.id,
					autoHideDuration: 5000,
					anchorOrigin: {
						horizontal: 'left',
						vertical: 'bottom',
					},
					content: (
						<ChatNotificationTemplate
							item={data}
							qna={qna}
							onClose={() => {
								closeSnackbar(data.id);
							}}
						/>
					),
				});
				dispatch(chatApi.util.invalidateTags(['chat']));
			};

			dispatch(setPassiveChatCallback(cb));

			let listenersList = [];

			chatListeners.forEach((item) => {
				if(item.closed) {
					const result = socket.off(
						`/user/${item.chatSession.id}/chat`
					);
					console.log('stop listener due to question status', result)
					dispatch(removeChatListener(item))
				}
			})

			qnaList.forEach((qnaItem) => {
				if (qnaItem.chatSession && chatListeners.findIndex(item => item.id === qnaItem.id) < 0) {
					
					const result = socket.on(
						`/user/${qnaItem.chatSession.id}/chat`,
						(data) => cb(data, qnaItem)
					);

					console.log(`🎉` )
					listenersList.push(qnaItem);
				}
			});
			console.log('listeners', listenersList);
			dispatch(addChatListeners(listenersList));
		}
		return () => {
			if (socket && chatListeners) {
				chatListeners.forEach((item) => {
					socket.off(`/user/${item.chatSession.id}/chat`);
				});
				dispatch(clearChatListeners());
			}
		};
	}, [socket, qnaList]);

	return null;
};

export default useChatNotification;

import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import io, { Socket } from 'socket.io-client';
import { useAppSelector } from '../../store/hooks';
import { selectAccount } from '../../store/user-slice';
import path from 'path';

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
	const [socketState, setSocketState] = useState<Socket | null>(null);
	const account = useAppSelector(selectAccount);
	// console.log('Socket context: ', socketRef?.current);
	useEffect(() => {
		if (account) {
			// setSocketState(
			// 	io('http://localhost:9092', { transports: ['websocket'] })
			// );
			console.log('connecting');
		} else if (socketState) {
			socketState.disconnect();
			setSocketState(null);

			console.log('Socket disconnecting, no account');
		}

		return () => {
			socketState?.disconnect();
			console.log('Socket disconnecting unmount', socketState);
			setSocketState(null);
		};
	}, [account]);

	return (
		<SocketContext.Provider value={socketState}>
			{children}
		</SocketContext.Provider>
	);
};

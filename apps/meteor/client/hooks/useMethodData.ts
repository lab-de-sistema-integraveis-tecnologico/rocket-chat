import { useToastMessageDispatch, ServerMethodParameters, ServerMethodReturn, ServerMethods, useMethod } from '@rocket.chat/ui-contexts';
import { useCallback, useEffect } from 'react';

import { AsyncState, useAsyncState } from './useAsyncState';

export const useMethodData = <TName extends keyof ServerMethods, Result = ServerMethodReturn<TName>>(
	methodName: TName,
	args: ServerMethodParameters<TName>,
	initialValue?: Result | (() => Result),
): AsyncState<Result> & { reload: () => void } => {
	const { resolve, reject, reset, ...state } = useAsyncState<Result>(initialValue);
	const dispatchToastMessage = useToastMessageDispatch();
	const getData = useMethod(methodName);

	const fetchData = useCallback(async () => {
		try {
			reset();
			const data = await getData(...args);
			resolve(data);
		} catch (error) {
			dispatchToastMessage({
				type: 'error',
				message: error,
			});
			reject(error);
		}
	}, [reset, getData, args, resolve, dispatchToastMessage, reject]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return {
		...state,
		reload: fetchData,
	};
};

import { Serialized } from '@rocket.chat/core-typings';
import type {
	MatchPathPattern,
	OperationParams,
	OperationResult,
	PathWithoutParamsFor,
	PathWithParamsFor,
	PathFor,
} from '@rocket.chat/rest-typings';
import { useToastMessageDispatch, useEndpoint } from '@rocket.chat/ui-contexts';
import { useCallback, useEffect } from 'react';

import { AsyncState, useAsyncState } from './useAsyncState';

export function useEndpointData<TPath extends PathWithParamsFor<'GET'>>(
	endpoint: TPath,
	params: Serialized<OperationParams<'GET', MatchPathPattern<TPath>>>,
	initialValue?:
		| Serialized<OperationResult<'GET', MatchPathPattern<TPath>>>
		| (() => Serialized<OperationResult<'GET', MatchPathPattern<TPath>>>),
): AsyncState<Serialized<OperationResult<'GET', MatchPathPattern<TPath>>>> & {
	reload: () => void;
};

export function useEndpointData<TPath extends PathWithoutParamsFor<'GET'>>(
	endpoint: TPath,
	params?: undefined,
	initialValue?:
		| Serialized<OperationResult<'GET', MatchPathPattern<TPath>>>
		| (() => Serialized<OperationResult<'GET', MatchPathPattern<TPath>>>),
): AsyncState<Serialized<OperationResult<'GET', MatchPathPattern<TPath>>>> & {
	reload: () => void;
};

export function useEndpointData<TPath extends PathFor<'GET'>>(
	endpoint: TPath,
	params?: Serialized<OperationParams<'GET', MatchPathPattern<TPath>>>,
	initialValue?:
		| Serialized<OperationResult<'GET', MatchPathPattern<TPath>>>
		| (() => Serialized<OperationResult<'GET', MatchPathPattern<TPath>>>),
): AsyncState<Serialized<OperationResult<'GET', MatchPathPattern<TPath>>>> & {
	reload: () => void;
} {
	const { resolve, reject, reset, ...state } = useAsyncState(initialValue);
	const dispatchToastMessage = useToastMessageDispatch();
	const getData = useEndpoint('GET', endpoint);

	const fetchData = useCallback(() => {
		reset();
		getData(params)
			.then(resolve)
			.catch((error) => {
				console.error(error);
				dispatchToastMessage({
					type: 'error',
					message: error,
				});
				reject(error);
			});
	}, [reset, getData, params, resolve, dispatchToastMessage, reject]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return {
		...state,
		reload: fetchData,
	};
}

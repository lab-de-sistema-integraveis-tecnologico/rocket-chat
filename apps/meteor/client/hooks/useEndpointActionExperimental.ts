import { Serialized } from '@rocket.chat/core-typings';
import type {
	MatchPathPattern,
	Method,
	OperationParams,
	OperationResult,
	PathFor,
	PathWithoutParamsFor,
	PathWithParamsFor,
} from '@rocket.chat/rest-typings';
import { useToastMessageDispatch, useEndpoint } from '@rocket.chat/ui-contexts';
import { useCallback } from 'react';

export function useEndpointActionExperimental<TMethod extends Method, TPath extends PathWithParamsFor<TMethod>>(
	method: TMethod,
	path: TPath,
	successMessage?: string,
): (
	params: Serialized<OperationParams<TMethod, MatchPathPattern<TPath>>>,
) => Promise<Serialized<OperationResult<TMethod, MatchPathPattern<TPath>>>>;

export function useEndpointActionExperimental<TMethod extends Method, TPath extends PathWithoutParamsFor<TMethod>>(
	method: TMethod,
	path: TPath,
	successMessage?: string,
): () => Promise<Serialized<OperationResult<TMethod, MatchPathPattern<TPath>>>>;

export function useEndpointActionExperimental<TMethod extends Method, TPath extends PathFor<TMethod>>(
	method: TMethod,
	path: TPath,
	successMessage?: string,
): (
	params?: Serialized<OperationParams<TMethod, MatchPathPattern<TPath>>>,
) => Promise<Serialized<OperationResult<TMethod, MatchPathPattern<TPath>>>> {
	const sendData = useEndpoint(method, path);
	const dispatchToastMessage = useToastMessageDispatch();

	return useCallback(
		async (params?: Serialized<OperationParams<TMethod, MatchPathPattern<TPath>>>) => {
			try {
				const data = await sendData(params);

				if (successMessage) {
					dispatchToastMessage({ type: 'success', message: successMessage });
				}

				return data;
			} catch (error: any) {
				dispatchToastMessage({ type: 'error', message: error });
				throw error;
			}
		},
		[dispatchToastMessage, sendData, successMessage],
	);
}

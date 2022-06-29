import type { Serialized } from '@rocket.chat/core-typings';
import type {
	Method,
	PathFor,
	OperationParams,
	MatchPathPattern,
	OperationResult,
	PathWithParamsFor,
	PathWithoutParamsFor,
} from '@rocket.chat/rest-typings';
import { useCallback, useContext } from 'react';

import { ServerContext } from '../ServerContext';

export function useEndpoint<TMethod extends Method, TPath extends PathWithParamsFor<TMethod>>(
	method: TMethod,
	path: TPath,
): (
	params: Serialized<OperationParams<TMethod, MatchPathPattern<TPath>>>,
) => Promise<Serialized<OperationResult<TMethod, MatchPathPattern<TPath>>>>;

export function useEndpoint<TMethod extends Method, TPath extends PathWithoutParamsFor<TMethod>>(
	method: TMethod,
	path: TPath,
): () => Promise<Serialized<OperationResult<TMethod, MatchPathPattern<TPath>>>>;

export function useEndpoint<TMethod extends Method, TPath extends PathFor<TMethod>>(method: TMethod, path: TPath): (
	params?: Serialized<OperationParams<TMethod, MatchPathPattern<TPath>>>,
) => Promise<Serialized<OperationResult<TMethod, MatchPathPattern<TPath>>>>;

export function useEndpoint<TMethod extends Method, TPath extends PathFor<TMethod>>(method: TMethod, path: TPath): any {
	const { callEndpoint } = useContext(ServerContext);

	return useCallback(
		(params: Serialized<OperationParams<TMethod, MatchPathPattern<TPath>>>) => callEndpoint(method, path, params),
		[callEndpoint, path, method],
	);
}

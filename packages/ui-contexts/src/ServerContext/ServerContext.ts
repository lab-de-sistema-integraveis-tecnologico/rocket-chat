import type { IServerInfo, Serialized } from '@rocket.chat/core-typings';
import type { Method, OperationParams, MatchPathPattern, OperationResult, PathFor } from '@rocket.chat/rest-typings';
import { createContext } from 'react';

import type { MethodName, MethodParametersMap, MethodResultPromiseMap } from './methods';

export type UploadResult = {
	success: boolean;
	status: string;
	[key: string]: unknown;
};

export type ServerContextValue = {
	info?: IServerInfo;
	absoluteUrl: (path: string) => string;
	callMethod?: <TName extends MethodName>(methodName: TName, ...args: MethodParametersMap[TName]) => MethodResultPromiseMap[TName];
	callEndpoint: <TMethod extends Method, TPath extends PathFor<TMethod>>(
		method: TMethod,
		path: TPath,
		params: Serialized<OperationParams<TMethod, MatchPathPattern<TPath>>>,
	) => Promise<Serialized<OperationResult<TMethod, MatchPathPattern<TPath>>>>;
	uploadToEndpoint: (
		endpoint: PathFor<'POST'>,
		formData: any,
	) =>
		| Promise<UploadResult>
		| {
				promise: Promise<UploadResult>;
		  };
	getStream: (streamName: string, options?: Record<string, unknown>) => <T>(eventName: string, callback: (data: T) => void) => () => void;
};

export const ServerContext = createContext<ServerContextValue>({
	info: undefined,
	absoluteUrl: (path) => path,
	callEndpoint: () => {
		throw new Error('not implemented');
	},
	uploadToEndpoint: async () => {
		throw new Error('not implemented');
	},
	getStream: () => () => (): void => undefined,
});

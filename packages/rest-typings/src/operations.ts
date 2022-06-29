import type { KeyOfEach } from '@rocket.chat/core-typings';

import type { ReplacePlaceholders } from './helpers/ReplacePlaceholders';
import type { Endpoints } from './endpoints';

type CreatePathTuple<TPath> = TPath extends `/${infer T}`
	? CreatePathTuple<T>
	: TPath extends `:${string}/${infer T}`
	? [string, ...CreatePathTuple<T>]
	: TPath extends `${infer H}/${infer T}`
	? [H, ...CreatePathTuple<T>]
	: [TPath extends `:${string}` ? string : TPath];

type ByPathPattern<TPathPattern extends keyof Endpoints> = TPathPattern extends any
	? OperationsByPathPatternAndMethod<TPathPattern>
	: never;

type GetParams<TOperation> = TOperation extends (...args: any) => any
	? Parameters<TOperation>[0] extends void
		? void
		: Parameters<TOperation>[0]
	: never;

type GetResult<TOperation> = TOperation extends (...args: any) => any ? ReturnType<TOperation> : never;

type OperationsByPathPatternAndMethod<
	TPathPattern extends keyof Endpoints,
	TMethod extends KeyOfEach<Endpoints[TPathPattern]> = KeyOfEach<Endpoints[TPathPattern]>,
> = TMethod extends any
	? {
			pathPattern: TPathPattern;
			pathTuple: CreatePathTuple<TPathPattern>;
			path: ReplacePlaceholders<TPathPattern>;
			method: TMethod;
			fn: Endpoints[TPathPattern][TMethod];
			params: GetParams<Endpoints[TPathPattern][TMethod]>;
			result: GetResult<Endpoints[TPathPattern][TMethod]>;
	  }
	: never;

export type Operations = ByPathPattern<keyof Endpoints>;

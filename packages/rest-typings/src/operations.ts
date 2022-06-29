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

type Args<TFunction> = TFunction extends (...args: any) => any ? Parameters<TFunction> : never;

type Result<TFunction> = TFunction extends (...args: any) => any ? ReturnType<TFunction> : never;

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
			args: Args<Endpoints[TPathPattern][TMethod]>;
			withParams: Args<Endpoints[TPathPattern][TMethod]> extends { length: 0 } ? false : true;
			withoutParams: Args<Endpoints[TPathPattern][TMethod]> extends { length: 0 }
				? true
				: undefined extends Args<Endpoints[TPathPattern][TMethod]>[0]
				? true
				: false;
			params: Args<Endpoints[TPathPattern][TMethod]> extends { length: 0 } ? void : Args<Endpoints[TPathPattern][TMethod]>[0];
			result: Result<Endpoints[TPathPattern][TMethod]>;
	  }
	: never;

type ByPathPattern<TPathPattern extends keyof Endpoints> = TPathPattern extends any
	? OperationsByPathPatternAndMethod<TPathPattern>
	: never;

export type Operations = ByPathPattern<keyof Endpoints>;

type PathToOperationMap = {
	[TOperation in Operations as TOperation['path']]: TOperation;
};

export type Method = Operations['method'];
export type PathPattern = Operations['pathPattern'];
export type Path = Operations['path'];

export type MethodFor<TPath extends Path> = PathToOperationMap[TPath]['method'];

type MethodToOperation = {
	[TOperation in Operations as TOperation['method']]: TOperation;
};

export type PathFor<TMethod extends Method> = MethodToOperation[TMethod]['path'];

type MethodToOperationWithParams = {
	[TOperation in Operations as TOperation['withParams'] extends true ? TOperation['method'] : never]: TOperation;
};

export type PathWithParamsFor<TMethod extends Method> = TMethod extends keyof MethodToOperationWithParams
	? MethodToOperationWithParams[TMethod]['path']
	: never;

type MethodToOperationWithoutParams = {
	[TOperation in Operations as TOperation['withoutParams'] extends true ? TOperation['method'] : never]: TOperation;
};

export type PathWithoutParamsFor<TMethod extends Method> = TMethod extends keyof MethodToOperationWithoutParams
	? MethodToOperationWithoutParams[TMethod]['path']
	: never;

export type OperationParams<TMethod extends Method, TPathPattern extends PathPattern> = Extract<
	Operations,
	{ method: TMethod; pathPattern: TPathPattern }
>['params'];

export type OperationArgs<TMethod extends Method, TPathPattern extends PathPattern> = Extract<
	Operations,
	{ method: TMethod; pathPattern: TPathPattern }
>['args'];

export type OperationResult<TMethod extends Method, TPathPattern extends PathPattern> = Extract<
	Operations,
	{ method: TMethod; pathPattern: TPathPattern }
>['result'];

type Split<TPath> = TPath extends `/${infer T}` ? Split<T> : TPath extends `${infer H}/${infer T}` ? [H, ...Split<T>] : [TPath];

type Match<TOperation extends Operations, TMethod, TSlices extends string[]> = TOperation extends any
	? TSlices extends TOperation['pathTuple']
		? TOperation['method'] extends TMethod
			? TOperation
			: never
		: never
	: never;

export type MatchOperation<TMethod extends string, TPath extends string> = Match<Operations, TMethod, Split<TPath>>;

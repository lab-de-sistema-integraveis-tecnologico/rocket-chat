import type { Serialized } from '@rocket.chat/core-typings';
import type {
	MatchPathPattern,
	OperationParams,
	PathFor,
	MatchOperation,
	PathWithParamsFor,
	PathWithoutParamsFor,
} from '@rocket.chat/rest-typings';

type Next<T extends (...args: any[]) => any> = (...args: Parameters<T>) => ReturnType<T>;

export type Middleware<T extends (...args: any[]) => any> = (context: Parameters<T>, next: Next<T>) => ReturnType<T>;

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface RestClientInterface {
	get<TPath extends PathWithParamsFor<'GET'>>(
		endpoint: TPath,
		params: MatchOperation<'GET', TPath>['params'],
		options?: Omit<RequestInit, 'method'>,
	): Promise<Serialized<MatchOperation<'GET', TPath>['result']>>;

	get<TPath extends PathWithoutParamsFor<'GET'>>(
		endpoint: TPath,
		params?: undefined,
		options?: Omit<RequestInit, 'method'>,
	): Promise<Serialized<MatchOperation<'GET', TPath>['result']>>;

	post<TPath extends PathWithParamsFor<'POST'>>(
		endpoint: TPath,
		params: MatchOperation<'POST', TPath>['params'],
		options?: Omit<RequestInit, 'method'>,
	): Promise<Serialized<MatchOperation<'POST', TPath>['result']>>;

	post<TPath extends PathWithoutParamsFor<'POST'>>(
		endpoint: TPath,
		params?: undefined,
		options?: Omit<RequestInit, 'method'>,
	): Promise<Serialized<MatchOperation<'POST', TPath>['result']>>;

	put<TPath extends PathWithParamsFor<'PUT'>>(
		endpoint: TPath,
		params: MatchOperation<'PUT', TPath>['params'],
		options?: Omit<RequestInit, 'method'>,
	): Promise<Serialized<MatchOperation<'PUT', TPath>['result']>>;

	put<TPath extends PathWithoutParamsFor<'PUT'>>(
		endpoint: TPath,
		params?: undefined,
		options?: Omit<RequestInit, 'method'>,
	): Promise<Serialized<MatchOperation<'PUT', TPath>['result']>>;

	delete<TPath extends PathWithParamsFor<'DELETE'>>(
		endpoint: TPath,
		params: MatchOperation<'DELETE', TPath>['params'],
		options?: Omit<RequestInit, 'method'>,
	): Promise<Serialized<MatchOperation<'DELETE', TPath>['result']>>;

	delete<TPath extends PathWithoutParamsFor<'DELETE'>>(
		endpoint: TPath,
		params?: undefined,
		options?: Omit<RequestInit, 'method'>,
	): Promise<Serialized<MatchOperation<'DELETE', TPath>['result']>>;

	upload<TPath extends PathFor<'POST'>>(
		endpoint: TPath,
		params: void extends OperationParams<'POST', MatchPathPattern<TPath>> ? void : OperationParams<'POST', MatchPathPattern<TPath>>,
		events?: {
			load?: (event: ProgressEvent<XMLHttpRequestEventTarget>) => void;
			progress?: (event: ProgressEvent<XMLHttpRequestEventTarget>) => void;
			abort?: (event: ProgressEvent<XMLHttpRequestEventTarget>) => void;
			error?: (event: ProgressEvent<XMLHttpRequestEventTarget>) => void;
		},
	): XMLHttpRequest;

	getCredentials():
		| {
				'X-User-Id': string;
				'X-Auth-Token': string;
		  }
		| undefined;
	setCredentials(credentials: undefined | { 'X-User-Id': string; 'X-Auth-Token': string }): void;

	use(middleware: Middleware<RestClientInterface['send']>): void;

	send(endpoint: string, method: string, options: Omit<RequestInit, 'method'>): Promise<Response>;
}

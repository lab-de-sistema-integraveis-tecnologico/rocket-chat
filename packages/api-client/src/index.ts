import { stringify } from 'query-string';

import type { Serialized } from '../../core-typings/dist';
import type { PathWithParamsFor, PathWithoutParamsFor, MatchOperation } from '../../rest-typings/dist';
import type { Middleware, RestClientInterface } from './RestClientInterface';

export { RestClientInterface };

const pipe =
	<T extends (...args: any[]) => any>(fn: T) =>
	(...args: Parameters<T>): ReturnType<T> =>
		fn(...args);

function buildFormData(data?: Record<string, any> | void, formData = new FormData(), parentKey?: string): FormData {
	if (data instanceof FormData) {
		return data;
	}
	if (!data) {
		return formData;
	}

	if (typeof data === 'object' && !(data instanceof File)) {
		Object.keys(data).forEach((key) => {
			buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
		});
	} else {
		data && parentKey && formData.append(parentKey, data);
	}
	return formData;
}

const checkIfIsFormData = (data: any = {}): boolean => {
	if (data instanceof FormData) {
		return true;
	}
	return Object.values(data).some((value) => {
		if (typeof value === 'object' && !(value instanceof File)) {
			return checkIfIsFormData(value);
		}
		return value instanceof File;
	});
};

export class RestClient implements RestClientInterface {
	private readonly baseUrl: string;

	private headers: Record<string, string> = {};

	private credentials:
		| {
				'X-User-Id': string;
				'X-Auth-Token': string;
		  }
		| undefined;

	constructor({
		baseUrl,
		credentials,
		headers = {},
	}: {
		baseUrl: string;
		credentials?: {
			'X-User-Id': string;
			'X-Auth-Token': string;
		};
		headers?: Record<string, string>;
	}) {
		this.baseUrl = `${baseUrl}/api`;
		this.setCredentials(credentials);
		this.headers = headers;
	}

	getCredentials(): ReturnType<RestClientInterface['getCredentials']> {
		return this.credentials;
	}

	setCredentials: RestClientInterface['setCredentials'] = (credentials) => {
		this.credentials = credentials;
	};

	async get<TPath extends PathWithParamsFor<'GET'>>(
		endpoint: TPath,
		params: MatchOperation<'GET', TPath>['params'],
		options?: Omit<RequestInit, 'method'>,
	): Promise<Serialized<MatchOperation<'GET', TPath>['result']>>;

	async get<TPath extends PathWithoutParamsFor<'GET'>>(
		endpoint: TPath,
		params?: undefined,
		options?: Omit<RequestInit, 'method'>,
	): Promise<Serialized<MatchOperation<'GET', TPath>['result']>>;

	async get<TPath extends PathWithoutParamsFor<'GET'>>(
		endpoint: TPath,
		params?: MatchOperation<'GET', TPath>['params'],
		options?: Omit<RequestInit, 'method'>,
	): Promise<Serialized<MatchOperation<'GET', TPath>['result']>> {
		if (/\?/.test(endpoint)) {
			// throw new Error('Endpoint cannot contain query string');
			console.warn('Endpoint cannot contain query string', endpoint);
		}
		const queryParams = this.getParams(params);
		const response = await this.send(`${endpoint}${queryParams ? `?${queryParams}` : ''}`, 'GET', options);
		return response.json();
	}

	async post<TPath extends PathWithParamsFor<'POST'>>(
		endpoint: TPath,
		params: MatchOperation<'POST', TPath>['params'],
		options?: Omit<RequestInit, 'method'>,
	): Promise<Serialized<MatchOperation<'POST', TPath>['result']>>;

	async post<TPath extends PathWithoutParamsFor<'POST'>>(
		endpoint: TPath,
		params?: undefined,
		options?: Omit<RequestInit, 'method'>,
	): Promise<Serialized<MatchOperation<'POST', TPath>['result']>>;

	async post<TPath extends PathWithoutParamsFor<'POST'>>(
		endpoint: TPath,
		params?: MatchOperation<'POST', TPath>['params'],
		{ headers, ...options }: Omit<RequestInit, 'method'> = {},
	): Promise<Serialized<MatchOperation<'POST', TPath>['result']>> {
		const isFormData = checkIfIsFormData(params);

		const response = await this.send(endpoint, 'POST', {
			body: isFormData ? buildFormData(params) : JSON.stringify(params),

			headers: {
				Accept: 'application/json',
				...(!isFormData && { 'Content-Type': 'application/json' }),
				...headers,
			},

			...options,
		});
		return response.json();
	}

	async put<TPath extends PathWithParamsFor<'PUT'>>(
		endpoint: TPath,
		params: MatchOperation<'PUT', TPath>['params'],
		options?: Omit<RequestInit, 'method'>,
	): Promise<Serialized<MatchOperation<'PUT', TPath>['result']>>;

	async put<TPath extends PathWithoutParamsFor<'PUT'>>(
		endpoint: TPath,
		params?: undefined,
		options?: Omit<RequestInit, 'method'>,
	): Promise<Serialized<MatchOperation<'PUT', TPath>['result']>>;

	async put<TPath extends PathWithoutParamsFor<'PUT'>>(
		endpoint: TPath,
		params?: MatchOperation<'PUT', TPath>['params'],
		{ headers, ...options }: Omit<RequestInit, 'method'> = {},
	): Promise<Serialized<MatchOperation<'PUT', TPath>['result']>> {
		const isFormData = checkIfIsFormData(params);
		const response = await this.send(endpoint, 'PUT', {
			body: isFormData ? buildFormData(params) : JSON.stringify(params),

			headers: {
				Accept: 'application/json',
				...(!isFormData && { 'Content-Type': 'application/json' }),
				...headers,
			},

			...options,
		});
		return response.json();
	}

	async delete<TPath extends PathWithParamsFor<'DELETE'>>(
		endpoint: TPath,
		params: MatchOperation<'DELETE', TPath>['params'],
		options?: Omit<RequestInit, 'method'>,
	): Promise<Serialized<MatchOperation<'DELETE', TPath>['result']>>;

	async delete<TPath extends PathWithoutParamsFor<'DELETE'>>(
		endpoint: TPath,
		params?: undefined,
		options?: Omit<RequestInit, 'method'>,
	): Promise<Serialized<MatchOperation<'DELETE', TPath>['result']>>;

	async delete<TPath extends PathWithoutParamsFor<'DELETE'>>(
		endpoint: TPath,
		params?: MatchOperation<'DELETE', TPath>['params'],
		options: Omit<RequestInit, 'method'> = {},
	): Promise<Serialized<MatchOperation<'DELETE', TPath>['result']>> {
		const response = await this.send(endpoint, 'DELETE', options);
		return response.json();
	}

	protected getCredentialsAsHeaders(): Record<string, string> {
		const credentials = this.getCredentials();
		return credentials
			? {
					'X-User-Id': credentials['X-User-Id'],
					'X-Auth-Token': credentials['X-Auth-Token'],
			  }
			: {};
	}

	send(endpoint: string, method: string, { headers, ...options }: Omit<RequestInit, 'method'> = {}): Promise<Response> {
		return fetch(`${this.baseUrl}${`/${endpoint}`.replace(/\/+/, '/')}`, {
			...options,
			headers: { ...this.getCredentialsAsHeaders(), ...this.headers, ...headers },
			method,
		}).then(function (response) {
			if (!response.ok) {
				return Promise.reject(response);
			}
			return response;
		});
	}

	protected getParams(data: Record<string, object | number | string | boolean> | void): string {
		return data ? stringify(data, { arrayFormat: 'bracket' }) : '';
	}

	upload: RestClientInterface['upload'] = (endpoint, params, events) => {
		if (!params) {
			throw new Error('Missing params');
		}
		const xhr = new XMLHttpRequest();
		const data = new FormData();

		Object.entries(params as any).forEach(([key, value]) => {
			if (value instanceof File) {
				data.append(key, value, value.name);
				return;
			}
			value && data.append(key, value as any);
		});

		xhr.open('POST', `${this.baseUrl}${`/${endpoint}`.replace(/\/+/, '/')}`, true);
		Object.entries(this.getCredentialsAsHeaders()).forEach(([key, value]) => {
			xhr.setRequestHeader(key, value);
		});

		if (events?.load) {
			xhr.upload.addEventListener('load', events.load);
		}
		if (events?.progress) {
			xhr.upload.addEventListener('progress', events.progress);
		}
		if (events?.error) {
			xhr.addEventListener('error', events.error);
		}
		if (events?.abort) {
			xhr.addEventListener('abort', events.abort);
		}

		xhr.send(data);

		return xhr;
	};

	use(middleware: Middleware<RestClientInterface['send']>): void {
		const fn = this.send.bind(this);
		this.send = function (this: RestClient, ...context: Parameters<RestClientInterface['send']>): ReturnType<RestClientInterface['send']> {
			return middleware(context, pipe(fn));
		} as RestClientInterface['send'];
	}
}

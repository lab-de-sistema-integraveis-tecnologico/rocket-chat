import type { Endpoints } from './endpoints';
import type { Operations } from './operations';

export { Endpoints };

type Split<TPath> = TPath extends `/${infer T}` ? Split<T> : TPath extends `${infer H}/${infer T}` ? [H, ...Split<T>] : [TPath];

export type PathPattern = Operations['pathPattern'];

export type Method = Operations['method'];

export type Path = Operations['path'];

export type MethodFor<TPath extends Path> = TPath extends any ? Extract<Operations, { path: TPath }>['method'] : never;

export type PathFor<TMethod extends Method> = TMethod extends any ? Extract<Operations, { method: TMethod }>['path'] : never;

type MethodToOperationWithParams = {
	[TOperation in Operations as Parameters<TOperation['fn']> extends { length: 1 } ? TOperation['method'] : never]: TOperation;
};

type MethodToOperationWithoutParams = {
	[TOperation in Operations as Parameters<TOperation['fn']> extends { length: 0 } ? TOperation['method'] : never]: TOperation;
};

export type PathWithParamsFor<TMethod extends Method> = TMethod extends keyof MethodToOperationWithParams
	? MethodToOperationWithParams[TMethod]['path']
	: never;

export type PathWithoutParamsFor<TMethod extends Method> = TMethod extends keyof MethodToOperationWithoutParams
	? MethodToOperationWithoutParams[TMethod]['path']
	: never;

type MatchOver<TOperations extends Operations, TSlices extends string[]> = TOperations extends any
	? TSlices extends TOperations['pathTuple']
		? TOperations
		: never
	: never;

export type MatchPathPattern<TPath extends Path> = MatchOver<Operations, Split<TPath>>['pathPattern'];

export type JoinPathPattern<TBasePath extends string, TSubPathPattern extends string> = Extract<
	PathPattern,
	`${TBasePath}/${TSubPathPattern}` | TSubPathPattern
>;

type GetParams<TOperation> = TOperation extends (...args: any) => any
	? Parameters<TOperation>[0] extends void
		? void
		: Parameters<TOperation>[0]
	: never;

type GetResult<TOperation> = TOperation extends (...args: any) => any ? ReturnType<TOperation> : never;

export type OperationParams<TMethod extends Method, TPathPattern extends PathPattern> = TMethod extends keyof Endpoints[TPathPattern]
	? GetParams<Endpoints[TPathPattern][TMethod]>
	: never;

export type OperationResult<TMethod extends Method, TPathPattern extends PathPattern> = TMethod extends keyof Endpoints[TPathPattern]
	? GetResult<Endpoints[TPathPattern][TMethod]>
	: never;

export type UrlParams<T extends string> = string extends T
	? Record<string, string>
	: T extends `${infer _Start}:${infer Param}/${infer Rest}`
	? { [k in Param | keyof UrlParams<Rest>]: string }
	: T extends `${infer _Start}:${infer Param}`
	? { [k in Param]: string }
	: undefined | {};

export type MethodOf<TPathPattern extends PathPattern> = TPathPattern extends any ? keyof Endpoints[TPathPattern] : never;

export * from './v1/permissions';
export * from './v1/roles';
export * from './v1/settings';
export * from './v1/teams';
export * from './v1/assets';
export * from './v1/channels/ChannelsAddAllProps';
export * from './v1/channels/ChannelsArchiveProps';
export * from './v1/channels/ChannelsUnarchiveProps';
export * from './v1/channels/ChannelsHistoryProps';
export * from './v1/channels/ChannelsRolesProps';
export * from './v1/channels/ChannelsJoinProps';
export * from './v1/channels/ChannelsKickProps';
export * from './v1/channels/ChannelsLeaveProps';
export * from './v1/channels/ChannelsMessagesProps';
export * from './v1/channels/ChannelsOpenProps';
export * from './v1/channels/ChannelsSetAnnouncementProps';
export * from './v1/channels/ChannelsGetAllUserMentionsByChannelProps';
export * from './v1/channels/ChannelsModeratorsProps';
export * from './v1/channels/ChannelsConvertToTeamProps';
export * from './v1/channels/ChannelsSetReadOnlyProps';
export * from './v1/channels/ChannelsDeleteProps';

export * from './v1/subscriptionsEndpoints';
export * from './v1/misc';
export * from './v1/invites';

export * from './v1/dm';
export * from './v1/dm/DmHistoryProps';
export * from './v1/integrations';
export * from './v1/omnichannel';
export * from './v1/oauthapps';
export * from './helpers/PaginatedRequest';
export * from './helpers/PaginatedResult';
export * from './helpers/ReplacePlaceholders';
export * from './v1/emojiCustom';

export * from './v1/users';
export * from './v1/users/UsersSetAvatarParamsPOST';
export * from './v1/users/UsersSetPreferenceParamsPOST';
export * from './v1/users/UsersUpdateOwnBasicInfoParamsPOST';
export * from './v1/users/UsersUpdateParamsPOST';
export * from './v1/e2e/e2eGetUsersOfRoomWithoutKeyParamsGET';
export * from './v1/e2e/e2eSetRoomKeyIDParamsPOST';
export * from './v1/e2e/e2eSetUserPublicAndPrivateKeysParamsPOST';
export * from './v1/e2e/e2eUpdateGroupKeyParamsPOST';
export * from './v1/import/UploadImportFileParamsPOST';
export * from './v1/import/DownloadPublicImportFileParamsPOST';
export * from './v1/import/StartImportParamsPOST';
export * from './v1/import/GetImportFileDataParamsGET';
export * from './v1/import/GetImportProgressParamsGET';
export * from './v1/import/GetLatestImportOperationsParamsGET';
export * from './v1/import/DownloadPendingFilesParamsPOST';
export * from './v1/import/DownloadPendingAvatarsParamsPOST';
export * from './v1/import/GetCurrentImportOperationParamsGET';

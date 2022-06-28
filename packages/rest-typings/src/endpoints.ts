import type { AppsEndpoints } from './apps';
import type { AutoTranslateEndpoints } from './v1/autoTranslate';
import type { AssetsEndpoints } from './v1/assets';
import type { BannersEndpoints } from './v1/banners';
import type { ChannelsEndpoints } from './v1/channels';
import type { ChatEndpoints } from './v1/chat';
import type { CloudEndpoints } from './v1/cloud';
import type { CustomSoundEndpoint } from './v1/customSounds';
import type { CustomUserStatusEndpoints } from './v1/customUserStatus';
import type { DnsEndpoints } from './v1/dns';
import type { E2eEndpoints } from './v1/e2e';
import type { EmojiCustomEndpoints } from './v1/emojiCustom';
import type { GroupsEndpoints } from './v1/groups';
import type { ImEndpoints, DmEndpoints } from './v1/dm';
import type { InstancesEndpoints } from './v1/instances';
import type { IntegrationsEndpoints } from './v1/integrations';
import type { InvitesEndpoints } from './v1/invites';
import type { LDAPEndpoints } from './v1/ldap';
import type { LicensesEndpoints } from './v1/licenses';
import type { MiscEndpoints } from './v1/misc';
import type { OmnichannelEndpoints } from './v1/omnichannel';
import type { PermissionsEndpoints } from './v1/permissions';
import type { PushEndpoints } from './v1/push';
import type { RolesEndpoints } from './v1/roles';
import type { RoomsEndpoints } from './v1/rooms';
import type { SettingsEndpoints } from './v1/settings';
import type { StatisticsEndpoints } from './v1/statistics';
import type { TeamsEndpoints } from './v1/teams';
import type { UsersEndpoints } from './v1/users';
import type { VideoConferenceEndpoints } from './v1/videoConference';
import type { VoipEndpoints } from './v1/voip';
import type { EmailInboxEndpoints } from './v1/email-inbox';
import type { WebdavEndpoints } from './v1/webdav';
import type { OAuthAppsEndpoint } from './v1/oauthapps';
import type { CommandsEndpoints } from './v1/commands';
import type { MeEndpoints } from './v1/me';
import type { SubscriptionsEndpoints } from './v1/subscriptionsEndpoints';

// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/interface-name-prefix
export interface Endpoints
	extends ChannelsEndpoints,
		MeEndpoints,
		BannersEndpoints,
		ChatEndpoints,
		CommandsEndpoints,
		CloudEndpoints,
		CommandsEndpoints,
		CustomUserStatusEndpoints,
		DmEndpoints,
		DnsEndpoints,
		EmojiCustomEndpoints,
		GroupsEndpoints,
		ImEndpoints,
		LDAPEndpoints,
		RoomsEndpoints,
		PushEndpoints,
		RolesEndpoints,
		TeamsEndpoints,
		SettingsEndpoints,
		UsersEndpoints,
		AppsEndpoints,
		OmnichannelEndpoints,
		StatisticsEndpoints,
		LicensesEndpoints,
		MiscEndpoints,
		PermissionsEndpoints,
		InstancesEndpoints,
		IntegrationsEndpoints,
		VoipEndpoints,
		VideoConferenceEndpoints,
		InvitesEndpoints,
		E2eEndpoints,
		AssetsEndpoints,
		CustomSoundEndpoint,
		EmailInboxEndpoints,
		WebdavEndpoints,
		OAuthAppsEndpoint,
		SubscriptionsEndpoints,
		AutoTranslateEndpoints {}

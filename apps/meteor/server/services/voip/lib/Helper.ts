import { ServerType, IVoipManagementServerConfig, IVoipCallServerConfig } from '@rocket.chat/core-typings';

import { settings } from '../../../../app/settings/server/cached';

export function getServerConfigDataFromSettings(type: ServerType): IVoipCallServerConfig | IVoipManagementServerConfig {
	switch (type) {
		case ServerType.CALL_SERVER: {
			const serverConfig: IVoipCallServerConfig = {
				type: ServerType.CALL_SERVER,
				name: settings.get<string>('VoIP_Server_Name'),
				configData: {
					websocketPath: settings.get<string>('VoIP_Server_Websocket_Path'),
				},
			};
			return serverConfig;
		}

		case ServerType.MANAGEMENT: {
			const serverConfig: IVoipManagementServerConfig = {
				type: ServerType.MANAGEMENT,
				host: settings.get<string>('VoIP_Management_Server_Host'),
				name: settings.get<string>('VoIP_Management_Server_Name'),
				configData: {
					port: Number(settings.get<number>('VoIP_Management_Server_Port')),
					username: settings.get<string>('VoIP_Management_Server_Username'),
					password: settings.get<string>('VoIP_Management_Server_Password'),
				},
			};
			return serverConfig;
		}
	}
}

export function voipEnabled(): boolean {
	return settings.get<boolean>('VoIP_Enabled');
}

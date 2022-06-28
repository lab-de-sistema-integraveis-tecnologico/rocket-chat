import { IMessage, isTranslatedMessage, ITranslatedMessage } from '@rocket.chat/core-typings';
import { MarkdownAST, parser } from '@rocket.chat/message-parser';
import { useMemo } from 'react';

import { useShowTranslated } from '../contexts/MessageListContext';
import { useAutotranslateLanguage } from './useAutotranslateLanguage';

export function useParsedMessage(message: IMessage & Partial<ITranslatedMessage>): MarkdownAST {
	const autoTranslateLanguage = useAutotranslateLanguage(message.rid);
	const translated = useShowTranslated({ message });

	return useMemo(() => {
		if (translated && autoTranslateLanguage && isTranslatedMessage(message)) {
			return parser(message.translations[autoTranslateLanguage]);
		}
		if (message.md) {
			return message.md;
		}
		if (!message.msg) {
			return [];
		}
		return parser(message.msg);
	}, [message, autoTranslateLanguage, translated]);
}

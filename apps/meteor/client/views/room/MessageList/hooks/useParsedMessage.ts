import { IMessage, isTranslatedMessage } from '@rocket.chat/core-typings';
import { MarkdownAST, parser } from '@rocket.chat/message-parser';
import { useMemo } from 'react';

import { useShowTranslated } from '../contexts/MessageListContext';
import { useAutotranslateLanguage } from './useAutotranslateLanguage';

export function useParsedMessage(message: Pick<IMessage, 'md' | 'msg' | 'rid' | 'ts' | 'u' | '_id' | '_updatedAt'>): MarkdownAST {
	const autoTranslateLanguage = useAutotranslateLanguage(message.rid);
	const translated = useShowTranslated({ message });
	const shouldTranslate = autoTranslateLanguage && translated && isTranslatedMessage(message);

	return useMemo(() => {
		if (shouldTranslate) {
			return parser(message.translations[autoTranslateLanguage]);
		}
		if (message.md) {
			return message.md;
		}
		if (!message.msg) {
			return [];
		}
		return parser(message.msg);
	}, [message, autoTranslateLanguage, shouldTranslate]);
}

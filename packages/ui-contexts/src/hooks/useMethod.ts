import { useCallback, useContext } from 'react';

import { ServerContext } from '../ServerContext';
import type { MethodResultPromiseMap, MethodParametersMap, Methods } from '../ServerContext/methods';

export const useMethod = <TName extends keyof Methods>(
	methodName: TName,
): ((...args: MethodParametersMap[TName]) => MethodResultPromiseMap[TName]) => {
	const { callMethod } = useContext(ServerContext);

	if (!callMethod) {
		throw new Error(`cannot use useMethod(${methodName}) hook without a wrapping ServerContext`);
	}

	return useCallback((...args: MethodParametersMap[TName]) => callMethod(methodName, ...args), [callMethod, methodName]);
};

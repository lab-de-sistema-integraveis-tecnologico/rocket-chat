import { useContext } from 'react';

import { DeviceContext, Device } from '../DeviceContext';

type setInputMediaDevice = (inputDevice: Device) => void;

export const useSetInputMediaDevice = (): setInputMediaDevice => useContext(DeviceContext).setAudioInputDevice;

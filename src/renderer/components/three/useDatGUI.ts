import { useState, useEffect, memo, useCallback } from 'react';
import { GUI } from 'dat.gui';
import _forIn from 'lodash/forIn';
import _mapValues from 'lodash/mapValues';

interface Stepper {
  initialValue: number;
  min: number;
  max: number;
  step: number;
}

export interface UseDatGuiParams {
  [key: string]: string | boolean | Stepper;
}

const useDatGUI = <T extends UseDatGuiParams>(params: T): T => {
  const [config, setConfig] = useState(params);
  useEffect(() => {
    const gui = new GUI({ autoPlace: true });
    const reformattedParams = _mapValues(config, (value) => {
      if (typeof value === 'object') {
        return (value as Stepper).initialValue;
      }
      return value;
    });
    _forIn(params, (value, key) => {
      if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
      ) {
        gui.add(reformattedParams, key).onChange((v) => {
          const configCopy = { ...config, [key]: v };
          setConfig(configCopy);
        });
      }
      if (typeof value === 'object') {
        const { min, max, step } = value as Stepper;
        gui.add(reformattedParams, key, min, max, step).onChange((v) => {
          const configCopy = {
            ...config,
            [key]: { initialValue: v },
          };
          setConfig(configCopy);
        });
      }
    });
  }, []);
  return config;
};

export default useDatGUI;

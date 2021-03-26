/**
 * Helpers for work with context object which will be passed in all operation handlers
 *
 * @module Context
 */

import { inspect } from 'util';

import { AxiosRequestConfig } from 'axios';

import { TContext, TLogData } from '../types';

import { TAgent } from './agent';

export const createContext = <CH>(
  agent: TAgent,
  contextHelpers: CH
): TContext<CH> => {
  const request = (config: AxiosRequestConfig, jsonOverride = true) => {
    return agent.request({
      ...config,
      responseType: jsonOverride ? 'json' : 'text',
    });
  };
  const log = (data: TLogData) => {
    console.log(inspect(data, false, null, true));
    return agent.request({
      url: '/$loggy',
      method: 'post',
      data,
    });
  };
  const psql = async <T>(query: string): Promise<readonly T[]> => {
    const response = await request({
      url: '/$psql',
      method: 'post',
      data: { query },
    });
    return response.data[0].result;
  };

  return { request, psql, log, ...contextHelpers };
};

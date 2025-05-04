import { createReducers } from '@lib/redux';
import { merge } from 'lodash';

import { updateUIValue } from './actions';

const initialState = {
  siteName: '',
  logo: '',
  menus: [],
  favicon: '/favicon.ico'
};

const uiReducers = [
  {
    on: updateUIValue,
    reducer(state: any, data: any) {
      if (typeof window !== 'undefined') {
        Object.keys(data.payload).forEach(
          (key) => localStorage && localStorage.setItem(key, data.payload[key])
        );
      }
      return {
        ...state,
        ...data.payload
      };
    }
  }
];

export default merge({}, createReducers('ui', [uiReducers], initialState));

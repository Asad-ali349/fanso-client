/* eslint-disable no-console */
import { createSagas } from '@lib/redux';
import { messageService } from '@services/message.service';
import { message } from 'antd';
import { flatten } from 'lodash';
import { put, select } from 'redux-saga/effects';
import { IReduxAction } from 'src/interfaces';

import {
  deleteMessage,
  deleteMessageFail,
  deleteMessageSuccess,
  loadMoreStreamMessages,
  loadMoreStreamMessagesFail,
  loadMoreStreamMessagesSuccess,
  loadStreamMessages,
  loadStreamMessagesSuccess,
  sendStreamMessage,
  sendStreamMessageSuccess
} from './actions';

const streamMessageSagas = [
  {
    on: loadStreamMessages,
    * worker(data: IReduxAction<Record<string, any>>) {
      try {
        const {
          conversationId, offset, limit
        } = data.payload;
        const resp = yield messageService.getStreamMessages(conversationId, {
          offset,
          limit
        });
        yield put(
          loadStreamMessagesSuccess({
            conversationId,
            items: resp.data.data,
            total: resp.data.total
          })
        );
      } catch (e) {
        // load error
        console.log('err', e);
      }
    }
  },
  {
    on: loadMoreStreamMessages,
    * worker(data: IReduxAction<Record<string, any>>) {
      try {
        const {
          conversationId, offset, limit
        } = data.payload;
        const resp = yield messageService.getStreamMessages(conversationId, {
          offset,
          limit
        });
        yield put(
          loadMoreStreamMessagesSuccess({
            conversationId,
            items: resp.data.data,
            total: resp.data.total
          })
        );
      } catch (e) {
        yield put(loadMoreStreamMessagesFail(e));
      }
    }
  },
  {
    on: sendStreamMessage,
    * worker(req: IReduxAction<any>) {
      try {
        const { conversationId, data } = req.payload;
        const resp = yield messageService.sendStreamMessage(conversationId, data);

        yield put(sendStreamMessageSuccess(resp.data));
      } catch (e) {
        yield put(sendStreamMessageSuccess(e));
      }
    }
  },
  {
    on: deleteMessage,
    * worker(req: IReduxAction<any>) {
      try {
        const { messageId } = req.payload;
        const resp = yield messageService.deleteMessage(messageId);
        yield put(deleteMessageSuccess(resp.data));
      } catch (e) {
        yield put(deleteMessageFail(e));
      }
    }
  }
];

export default flatten([createSagas(streamMessageSagas)]);

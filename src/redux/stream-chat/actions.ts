import { createAction, createAsyncAction } from '@lib/redux';

export const getStreamConversationSuccess = createAction('getStreamConversationSuccess');

export const {
  sendStreamMessage,
  sendStreamMessageSuccess,
  sendStreamMessageFail
} = createAsyncAction('sendStreamMessage', 'SEND_STREAM_MESSAGE');

export const receiveStreamMessageSuccess = createAction('receiveStreamMessageSuccess');

export const {
  loadStreamMessages,
  loadStreamMessagesSuccess,
  loadStreamMessagesFail
} = createAsyncAction('loadStreamMessages', 'LOAD_STREAM_MESSAGES');

export const {
  loadMoreStreamMessages,
  loadMoreStreamMessagesSuccess,
  loadMoreStreamMessagesFail
} = createAsyncAction('loadMoreStreamMessages', 'LOAD_MORE_STREAM_MESSAGES');

export const resetStreamMessage = createAction('resetStreamMessage');
export const resetAllStreamMessage = createAction('resetAllStreamMessage');

export const {
  deleteMessage,
  deleteMessageSuccess,
  deleteMessageFail
} = createAsyncAction('deleteMessage', 'DELETE_MESSAGE');

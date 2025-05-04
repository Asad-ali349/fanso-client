import { APIRequest } from './api-request';

export class MessageService extends APIRequest {
  getConversations(query?: Record<string, any>) {
    return this.get(this.buildUrl('/conversations', query));
  }

  searchConversations(query?: Record<string, any>) {
    return this.get(this.buildUrl('/conversations/search', query));
  }

  createConversation(data: Record<string, string>) {
    return this.post('/conversations', data);
  }

  getConversationDetail(id: string) {
    return this.get(`/conversations/${id}`);
  }

  getMessages(conversationId: string, query?: Record<string, any>) {
    return this.get(this.buildUrl(`/messages/conversations/${conversationId}`, query));
  }

  uploadPublicPhoto(file: File, payload: any, onProgress?: Function) {
    return this.upload(
      '/messages/public/file/photo',
      [
        {
          fieldname: 'file',
          file
        }
      ],
      {
        onProgress,
        customData: payload
      }
    );
  }

  uploadVideo(file: File, payload: any, onProgress?: Function) {
    return this.upload(
      '/messages/private/file/video',
      [
        {
          fieldname: 'file',
          file
        }
      ],
      {
        onProgress,
        customData: payload
      }
    );
  }

  sendMessage(conversationId: string, data: Record<string, any>) {
    return this.post(`/messages/conversations/${conversationId}`, data);
  }

  deleteMessage(id) {
    return this.del(`/messages/${id}`);
  }

  countTotalNotRead() {
    return this.get('/messages/total-unread-messages');
  }

  readAllInConversation(conversationId: string) {
    return this.post(`/messages/read-all/${conversationId}`);
  }

  getMessageUploadUrl() {
    const endpoint = this.getBaseApiEndpoint();
    return new URL('/messages/private/file', endpoint).href;
  }

  getPublicMessages(conversationId: string, query?: Record<string, any>) {
    return this.get(this.buildUrl(`/messages/conversations/public/${conversationId}`, query));
  }

  // stream messages

  getStreamMessages(conversationId: string, query?: Record<string, any>) {
    return this.get(this.buildUrl(`/messages/stream/${conversationId}`, query));
  }

  sendStreamMessage(conversationId: string, data: Record<string, any>) {
    return this.post(`/messages/stream/${conversationId}`, data);
  }

  deleteAllMessageInConversation(conversationId) {
    return this.del(`/messages/stream/${conversationId}/remove-all-message`);
  }

  findPublicConversationPerformer(performerId: string) {
    return this.get(`/conversations/stream/performer/${performerId}`);
  }

  updateConversationName(conversationId, data) {
    return this.put(`/conversations/stream/${conversationId}/update`, data);
  }

  getVideoFileStatus(messageId: string, fileId: string) {
    return this.get(`/messages/${messageId}/file/${fileId}/status`);
  }
}

export const messageService = new MessageService();

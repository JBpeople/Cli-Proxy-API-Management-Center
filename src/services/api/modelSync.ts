import { apiClient } from './client';

export interface ModelSyncStatusItem {
  source_id: string;
  last_success_at?: string;
  last_attempt_at?: string;
  last_error?: string;
  model_count: number;
}

export interface ModelSyncStatusResponse {
  sources: Record<string, ModelSyncStatusItem>;
}

export interface ModelSyncRunResponse {
  ok: boolean;
  message?: string;
}

export const modelSyncApi = {
  async getStatus(): Promise<ModelSyncStatusResponse> {
    return apiClient.get('/model-sync/status');
  },
  async run(): Promise<ModelSyncRunResponse> {
    return apiClient.post('/model-sync/run');
  },
};

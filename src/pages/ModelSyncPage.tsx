import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { modelSyncApi, type ModelSyncStatusItem } from '@/services/api/modelSync';
import { useNotificationStore } from '@/stores';
import styles from './ModelSyncPage.module.scss';

const formatTime = (value?: string) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

export function ModelSyncPage() {
  const { t } = useTranslation();
  const { showNotification } = useNotificationStore();
  const [items, setItems] = useState<ModelSyncStatusItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await modelSyncApi.getStatus();
      const list = Object.values(data?.sources || {}).sort((a, b) =>
        a.source_id.localeCompare(b.source_id)
      );
      setItems(list);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err || 'Unknown error');
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleRun = async () => {
    setTriggering(true);
    try {
      const res = await modelSyncApi.run();
      showNotification(res?.message || t('model_sync.triggered', { defaultValue: 'Model sync triggered' }), 'success');
      await load();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err || 'Unknown error');
      showNotification(message, 'error');
    } finally {
      setTriggering(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>{t('model_sync.title', { defaultValue: 'Model Sync' })}</h1>
      <Card
        title={t('model_sync.title', { defaultValue: 'Model Sync' })}
        extra={
          <div className={styles.actions}>
            <Button variant="secondary" size="sm" onClick={() => void load()} loading={loading}>
              {t('common.refresh', { defaultValue: 'Refresh' })}
            </Button>
            <Button size="sm" onClick={() => void handleRun()} loading={triggering}>
              {t('model_sync.run_now', { defaultValue: 'Run now' })}
            </Button>
          </div>
        }
      >
        <p className={styles.description}>
          {t('model_sync.description', {
            defaultValue:
              'View upstream model discovery status and manually trigger a sync.',
          })}
        </p>
        {error ? <div className="error-box">{error}</div> : null}
        {!loading && items.length === 0 ? (
          <div className="hint">
            {t('model_sync.empty', { defaultValue: 'No model sync sources found.' })}
          </div>
        ) : (
          <div className={styles.list}>
            {items.map((item) => (
              <div key={item.source_id} className={styles.item}>
                <div className={styles.itemHeader}>
                  <div className={styles.itemTitle}>{item.source_id}</div>
                  <span className={`status-badge ${item.last_error ? 'error' : 'success'}`}>
                    {item.last_error
                      ? t('model_sync.status_error', { defaultValue: 'Error' })
                      : t('model_sync.status_ok', { defaultValue: 'OK' })}
                  </span>
                </div>
                <div className={styles.meta}>
                  <div>
                    <span className={styles.label}>{t('model_sync.model_count', { defaultValue: 'Model count' })}:</span>
                    <span>{item.model_count ?? 0}</span>
                  </div>
                  <div>
                    <span className={styles.label}>{t('model_sync.last_attempt', { defaultValue: 'Last attempt' })}:</span>
                    <span>{formatTime(item.last_attempt_at)}</span>
                  </div>
                  <div>
                    <span className={styles.label}>{t('model_sync.last_success', { defaultValue: 'Last success' })}:</span>
                    <span>{formatTime(item.last_success_at)}</span>
                  </div>
                </div>
                {item.last_error ? <div className={styles.error}>{item.last_error}</div> : null}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

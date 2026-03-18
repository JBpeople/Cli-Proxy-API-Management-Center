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
  useTranslation();
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
      showNotification(res?.message || '模型同步已触发', 'success');
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
      <h1 className={styles.pageTitle}>{'模型同步'}</h1>
      <Card
        title={'模型同步'}
        extra={
          <div className={styles.actions}>
            <Button variant="secondary" size="sm" onClick={() => void load()} loading={loading}>
              {'刷新'}
            </Button>
            <Button size="sm" onClick={() => void handleRun()} loading={triggering}>
              {'立即同步'}
            </Button>
          </div>
        }
      >
        <p className={styles.description}>
          {'查看上游模型发现状态，并手动触发同步。'}
        </p>
        {error ? <div className="error-box">{error}</div> : null}
        {!loading && items.length === 0 ? (
          <div className="hint">
            {'未找到模型同步源。'}
          </div>
        ) : (
          <div className={styles.list}>
            {items.map((item) => (
              <div key={item.source_id} className={styles.item}>
                <div className={styles.itemHeader}>
                  <div className={styles.itemTitle}>{item.source_id}</div>
                  <span className={`status-badge ${item.last_error ? 'error' : 'success'}`}>
                    {item.last_error
                      ? '异常'
                      : '正常'}
                  </span>
                </div>
                <div className={styles.meta}>
                  <div>
                    <span className={styles.label}>{'模型数量'}:</span>
                    <span>{item.model_count ?? 0}</span>
                  </div>
                  <div>
                    <span className={styles.label}>{'最近尝试'}:</span>
                    <span>{formatTime(item.last_attempt_at)}</span>
                  </div>
                  <div>
                    <span className={styles.label}>{'最近成功'}:</span>
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

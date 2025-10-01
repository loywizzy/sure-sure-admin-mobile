import { queryClient as defaultQueryClient } from './queryClient';
import { API_BASE } from './http';

type RealtimeSubscription = {
  disconnect: () => void;
};

function buildWsUrl(): string | null {
  try {
    const base = new URL(API_BASE);
    const wsProto = base.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsPath = (process.env.EXPO_PUBLIC_WS_PATH as string) || '/ws';
    return `${wsProto}//${base.hostname}${base.port ? `:${base.port}` : ''}${wsPath}`;
  } catch {
    return null;
  }
}

export function subscribeDashboard(qc = defaultQueryClient): RealtimeSubscription {
  let ws: WebSocket | null = null;
  let closed = false;
  let reconnectAttempts = 0;
  let pollTimer: ReturnType<typeof setInterval> | null = null;

  const startPollingFallback = () => {
    if (pollTimer) return;
    pollTimer = setInterval(() => {
      qc.invalidateQueries({ queryKey: ['transactions'] }).catch(() => {});
      qc.invalidateQueries({ queryKey: ['order-packages'] }).catch(() => {});
      qc.invalidateQueries({ queryKey: ['users'] }).catch(() => {});
      qc.invalidateQueries({ queryKey: ['packages'] }).catch(() => {});
    }, 20000);
  };

  const stopPollingFallback = () => {
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  };

  const tryConnect = () => {
    if (closed) return;
    const url = buildWsUrl();
    if (!url) {
      startPollingFallback();
      return;
    }

    try {
      ws = new WebSocket(url);
    } catch {
      startPollingFallback();
      return;
    }

    ws.onopen = () => {
      reconnectAttempts = 0;
      stopPollingFallback();
      // Optionally send a handshake/subscribe message if backend expects it
      // ws?.send(JSON.stringify({ type: 'subscribe', channels: ['transactions', 'packages', 'users'] }));
    };

    ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(String(evt.data));
        const type = data?.type as string | undefined;
        if (type === 'transaction:new' || type === 'transaction:update') {
          qc.invalidateQueries({ queryKey: ['transactions'] }).catch(() => {});
        }
        if (type === 'order-package:new' || type === 'order-package:update') {
          qc.invalidateQueries({ queryKey: ['order-packages'] }).catch(() => {});
        }
        if (type === 'user:update') {
          qc.invalidateQueries({ queryKey: ['users'] }).catch(() => {});
        }
        if (type === 'package:update') {
          qc.invalidateQueries({ queryKey: ['packages'] }).catch(() => {});
        }
      } catch {
        // On unknown payload, do a lightweight refresh of key datasets
        qc.invalidateQueries({ queryKey: ['transactions'] }).catch(() => {});
      }
    };

    const scheduleReconnect = () => {
      if (closed) return;
      reconnectAttempts += 1;
      const delay = Math.min(30000, 1000 * Math.pow(2, reconnectAttempts));
      setTimeout(tryConnect, delay);
    };

    ws.onerror = () => {
      startPollingFallback();
    };
    ws.onclose = () => {
      startPollingFallback();
      scheduleReconnect();
    };
  };

  tryConnect();

  return {
    disconnect: () => {
      closed = true;
      stopPollingFallback();
      try {
        ws?.close();
      } catch {}
      ws = null;
    },
  };
}



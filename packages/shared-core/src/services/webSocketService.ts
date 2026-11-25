import { useAuthStore } from '@auraflux/shared-core/stores/auth';
import type { WebSocketMessage, WebSocketServiceOptions } from '@auraflux/shared-core/interfaces/notification';


/**
 * Service to manage a WebSocket connection for receiving notifications and data updates.
 */
export class WebSocketService {
	private socket: WebSocket | null = null;
	private isConnected = false;
	private reconnectAttempts = 0;
	private reconnectTimer: number | null = null;
	private isExplicitClose = false;

	private url: string;
	private serviceScope?: string;
	private initialBackoffTimeMs: number;
	private maxBackoffTimeMs: number;
	private maxReconnectAttempts: number;
	private onMessageCallback?: (message: WebSocketMessage) => void;
	private onErrorCallback?: (error: Event) => void;
	private onStatusChangeCallback?: (status: 'connected' | 'disconnected' | 'reconnecting' | 'failed') => void;

	constructor(url: string, options?: WebSocketServiceOptions) {
		this.url = url;
		this.serviceScope = options?.serviceScope;
		this.initialBackoffTimeMs = options?.initialBackoffTimeMs ?? 1000;
		this.maxBackoffTimeMs = options?.maxBackoffTimeMs ?? 30000;
		this.maxReconnectAttempts = options?.maxReconnectAttempts ?? 5;
		this.onMessageCallback = options?.onMessage;
		this.onErrorCallback = options?.onError;
		this.onStatusChangeCallback = options?.onStatusChange;
	}

	private async resolveToken(): Promise<string | null> {
		if (!this.serviceScope) {
			return null;
		}

		try {
			const authStore = useAuthStore();
			if (await authStore.isServiceTokenExpired(this.serviceScope)) {
				await authStore.fetchServiceToken(this.serviceScope);
			}
			return authStore.accessTokens[this.serviceScope]?.token ?? null;
		} catch (error) {
			console.warn('⚠️ Failed to resolve WebSocket token:', error);
			return null;
		}
	}

	private buildConnectionUrl(token: string | null): string {
		const targetUrl = new URL(this.url, window.location.origin);
		if (token) {
			targetUrl.searchParams.set('token', token);
		} else {
			targetUrl.searchParams.delete('token');
		}
		return targetUrl.toString();
	}

	private setStatus(status: 'connected' | 'disconnected' | 'reconnecting' | 'failed') {
		if (this.onStatusChangeCallback) {
			this.onStatusChangeCallback(status);
		}
	}

	private calculateBackoff(attempt: number): number {
		const delay = this.initialBackoffTimeMs * Math.pow(2, attempt);
		const jitter = Math.random() * 0.1 * delay;
		return Math.min(delay + jitter, this.maxBackoffTimeMs);
	}

	private attemptReconnect = () => {
		if (this.isExplicitClose || this.reconnectAttempts >= this.maxReconnectAttempts) {
			this.setStatus('failed');
			console.error(`❌ WebSocket connection failed permanently after ${this.maxReconnectAttempts} attempts.`);
			return;
		}

		const delay = this.calculateBackoff(this.reconnectAttempts);
		this.reconnectAttempts++;
		this.setStatus('reconnecting');
		console.warn(`⏳ Attempting to reconnect in ${Math.round(delay / 1000)}s (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

		this.reconnectTimer = window.setTimeout(() => {
			this.connect();
		}, delay);
	};

	public connect = async () => {
		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer);
			this.reconnectTimer = null;
		}
		this.isExplicitClose = false;

		const token = await this.resolveToken();
		const connectionUrl = this.buildConnectionUrl(token);

		this.socket = new WebSocket(connectionUrl);

		this.socket.onopen = () => {
			this.isConnected = true;
			this.setStatus('connected');
			this.reconnectAttempts = 0;
			console.log('✅ WebSocket connection established.');
		};

		this.socket.onmessage = (event) => {
			try {
				const message = JSON.parse(event.data) as WebSocketMessage;
				if (this.onMessageCallback) {
					this.onMessageCallback(message);
				}
			} catch (e) {
				console.error('Error parsing or handling WebSocket message:', e);
				if (this.onErrorCallback) {
					this.onErrorCallback(event);
				}
			}
		};

		this.socket.onerror = (e) => {
			console.error('❌ WebSocket Error:', e);
			if (this.onErrorCallback) {
				this.onErrorCallback(e);
			}
		};

		this.socket.onclose = (event) => {
			this.isConnected = false;
			this.setStatus('disconnected');
			console.warn(`🛑 WebSocket closed. Code: ${event.code}. Clean: ${event.wasClean}.`);

			if (!this.isExplicitClose && (event.code !== 1000 || !event.wasClean)) {
				this.attemptReconnect();
			}
		};
	};

	public close = () => {
		this.isExplicitClose = true;
		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer);
			this.reconnectTimer = null;
		}
		if (this.socket && this.isConnected) {
			this.socket.close(1000, 'Service cleanup');
		}
	};

	public getIsConnected(): boolean {
		return this.isConnected;
	}
}

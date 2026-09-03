class UploadQueue {
	constructor(maxConcurrent = 1, onQueueUpdate = null) {
		this.queue = [];
		this.active = [];
		this.maxConcurrent = maxConcurrent;
		this.onQueueUpdate = onQueueUpdate;
		this.completed = [];
		this.failed = [];
	}

	add(uploader, metadata = {}) {
		const item = {
			id: `${Date.now()}-${Math.random()}`,
			uploader,
			metadata,
			status: 'queued', // queued, uploading, completed, failed, paused
			progress: 0,
		};

		this.queue.push(item);
		this.notifyUpdate();
		this.processQueue();

		return item.id;
	}

	async processQueue() {
		while (this.active.length < this.maxConcurrent && this.queue.length > 0) {
			const item = this.queue.shift();
			item.status = 'uploading';
			this.active.push(item);
			this.notifyUpdate();

			try {
				const result = await item.uploader.start();

				if (result) {
					item.status = 'completed';
					this.completed.push(item);
				} else {
					item.status = 'failed';
					this.failed.push(item);
				}
			} catch (error) {
				console.error('Upload error:', error);
				item.status = 'failed';
				this.failed.push(item);
			}

			this.active = this.active.filter((u) => u.id !== item.id);
			this.notifyUpdate();
		}
	}

	pause(itemId) {
		const item = this.active.find((u) => u.id === itemId);
		if (item) {
			item.uploader.pause();
			item.status = 'paused';
			this.notifyUpdate();
		}
	}

	async resume(itemId) {
		const item = this.active.find((u) => u.id === itemId);
		if (item) {
			item.status = 'uploading';
			this.notifyUpdate();
			const result = await item.uploader.resume();

			if (result) {
				item.status = 'completed';
				this.completed.push(item);
			} else {
				item.status = 'failed';
				this.failed.push(item);
			}

			this.active = this.active.filter((u) => u.id !== item.id);
			this.notifyUpdate();
			this.processQueue();
		}
	}

	async cancel(itemId) {
		const item = this.active.find((u) => u.id === itemId);
		if (item) {
			await item.uploader.cancel();
			item.status = 'cancelled';
			this.active = this.active.filter((u) => u.id !== item.id);
			this.notifyUpdate();
			this.processQueue();
		}
	}

	remove(itemId) {
		this.queue = this.queue.filter((u) => u.id !== itemId);
		this.notifyUpdate();
	}

	getStatus(itemId) {
		const item =
			this.active.find((u) => u.id === itemId) ||
			this.queue.find((u) => u.id === itemId) ||
			this.completed.find((u) => u.id === itemId) ||
			this.failed.find((u) => u.id === itemId);

		return item ? { ...item, uploaderStatus: item.uploader.getStatus() } : null;
	}

	getAll() {
		return {
			queued: this.queue,
			active: this.active,
			completed: this.completed,
			failed: this.failed,
		};
	}

	notifyUpdate() {
		if (this.onQueueUpdate) {
			this.onQueueUpdate({
				queued: this.queue.length,
				active: this.active.length,
				completed: this.completed.length,
				failed: this.failed.length,
				all: this.getAll(),
			});
		}
	}

	clear() {
		this.queue = [];
		this.active = [];
		this.completed = [];
		this.failed = [];
		this.notifyUpdate();
	}
}

export default UploadQueue;

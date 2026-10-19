type SessionExpiredListener = () => void;

const listeners = new Set<SessionExpiredListener>();

// The request layer sits outside React, so it announces an expired session
// here and whoever owns the store decides what clearing it means.
export const onSessionExpired = (listener: SessionExpiredListener) => {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
};

export const notifySessionExpired = () => {
    listeners.forEach((listener) => {
        listener();
    });
};

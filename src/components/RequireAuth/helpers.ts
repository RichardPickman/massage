export interface SignInLocationState {
    from: string;
}

export const toSignInLocationState = (path: string): SignInLocationState => ({
    from: path,
});

// History state is untyped at runtime, and only an app-relative path may be
// used as a return target: anything else would turn sign-in into an open
// redirect.
export const readSignInReturnPath = (state: unknown): string | null => {
    if (typeof state !== 'object' || state === null) {
        return null;
    }

    if (!('from' in state) || typeof state.from !== 'string') {
        return null;
    }

    if (!state.from.startsWith('/')) {
        return null;
    }

    return state.from;
};

export const paths = [
    {
        labelKey: 'nav.overview',
        path: '/',
        authRequired: false,
    },
    {
        labelKey: 'nav.lectures',
        path: '/lectures',
        authRequired: false,
    },
    {
        labelKey: 'nav.quizzes',
        path: '/quiz',
        authRequired: false,
    },
] as const;

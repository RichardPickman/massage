import {
    Link,
    redirect,
    useLoaderData,
    useLocation,
    useRevalidator,
    type LoaderFunctionArgs,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Paginator } from '../../components/Paginator';
import { isUnauthorised } from '../../services/errors';
import { Button } from '../../components/ui/button';
import { PageHeader } from '../../components/PageHeader';
import LectureService from '../../services/Lecture';
import { useAppSelector } from '../../store';
import { lectureListState } from '../../utils/lectureList';
import { pageSearch, readPage } from '../../utils/pagination';
import { LecturesTable } from './components/LecturesTable';
import { getTableRows, type LectureRow } from './helpers';

// Ten rows is what the table shows without scrolling on a laptop; the quizzes
// grid uses its own size.
const pageSize = 10;

interface LecturesLoaderData {
    rows: LectureRow[];
    page: number;
    pages: number;
}

export const Lectures = () => {
    const { t } = useTranslation();
    const { rows, page, pages } = useLoaderData() as LecturesLoaderData;
    const { isAuth, user } = useAppSelector((state) => state.auth);
    const revalidator = useRevalidator();
    const location = useLocation();

    const canManage = (author?: string) =>
        isAuth && (user?.role === 'admin' || String(author ?? '') === user?.id);

    // Handed to every row so the lecture can lead back to this exact page.
    const listState = lectureListState(location.pathname, location.search);

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title={t('lectures.title')}
                description={t('lectures.description')}
                meta={
                    isAuth ? (
                        <Button asChild size="sm">
                            <Link to="create">{t('lectures.add')}</Link>
                        </Button>
                    ) : undefined
                }
            />
            {rows.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                    {t('lectures.empty')}
                </p>
            ) : (
                <LecturesTable
                    rows={rows}
                    canManage={canManage}
                    listState={listState}
                    onRemoved={() => revalidator.revalidate()}
                />
            )}
            <Paginator page={page} pages={pages} />
        </div>
    );
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const requested = readPage(url.searchParams);

    let payload;

    try {
        ({ payload } = await LectureService.getLecturesPage(
            requested,
            pageSize
        ));
    } catch (error) {
        // The content sits behind a session, so a guest — or a tab whose token
        // expired — used to get the error boundary instead of the sign-in form.
        if (isUnauthorised(error)) {
            return redirect('/auth/login');
        }

        throw error;
    }

    // A stale link, or a page whose last row was just removed, comes back
    // clamped to the last page. Moving the address bar there is what keeps the
    // rows on screen and the URL in agreement.
    if (payload.page !== requested) {
        const search = pageSearch(url.searchParams, payload.page);

        return redirect(search ? `${url.pathname}?${search}` : url.pathname);
    }

    return {
        rows: getTableRows(payload.items),
        page: payload.page,
        pages: payload.pages,
    };
};

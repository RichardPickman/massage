import { useEffect, useLayoutEffect, useRef } from 'react';
import {
    Link,
    redirect,
    useLoaderData,
    useRevalidator,
    type LoaderFunctionArgs,
} from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { Paginator } from '../../components/Paginator';
import { Button } from '../../components/ui/button';
import QuizService from '../../services/Quiz';
import type { QuizSummary } from '../../services/models';
import type { Page } from '../../services/types';
import { useAppDispatch, useAppSelector } from '../../store';
import { setQuizzes } from '../../store/reducers/quizzes';
import { pageSearch, readPage } from '../../utils/pagination';
import { QuizCard } from './components/Card';

// Twelve fills four rows of the three-column grid; the lectures table carries
// its own size, so this constant stays local to the listing that uses it.
const pageSize = 12;

export const Quizzes = () => {
    const envelope = useLoaderData() as Page<QuizSummary>;
    const quizzes = useAppSelector((state) => state.quizzes.quizzes);
    const revision = useAppSelector((state) => state.quizzes.revision);
    const { isAuth } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const revalidator = useRevalidator();

    const lastRevision = useRef(revision);

    useLayoutEffect(() => {
        dispatch(setQuizzes(envelope));
    }, [dispatch, envelope]);

    // A removal drops the card locally for instant feedback; this reload is what
    // brings total and pages back in line with the server, and the loader's
    // clamp is what turns "the last card is gone" into the page before.
    useEffect(() => {
        if (lastRevision.current === revision) {
            return;
        }

        lastRevision.current = revision;
        revalidator.revalidate();
    }, [revalidator, revision]);

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Quizzes"
                description="Scored tests. Every attempt lands on your record."
                meta={
                    isAuth ? (
                        <Button asChild size="sm">
                            <Link to="constructor">Add quiz</Link>
                        </Button>
                    ) : undefined
                }
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {quizzes.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        There is no quiz yet.
                    </p>
                ) : (
                    quizzes.map((quiz) => (
                        <QuizCard key={quiz._id} quiz={quiz} />
                    ))
                )}
            </div>
            <Paginator page={envelope.page} pages={envelope.pages} />
        </div>
    );
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const requested = readPage(url.searchParams);

    const { payload } = await QuizService.getQuizzesPage(requested, pageSize);

    // A stale link, or a page whose last card was just removed, comes back
    // clamped to the last page. Moving the address bar there is what keeps cards
    // on screen instead of emptying the grid.
    if (payload.page !== requested) {
        const search = pageSearch(url.searchParams, payload.page);

        return redirect(search ? `${url.pathname}?${search}` : url.pathname);
    }

    return payload;
};

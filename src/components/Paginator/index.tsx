import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import { cn } from 'cn';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { pageSearch } from '../../utils/pagination';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
} from '../ui/pagination';

interface PaginatorProps {
    page: number;
    pages: number;
}

// A disabled control keeps its place in the row but leaves the tab order and
// stops taking clicks; its address is the page it is already on.
const disabledControl = 'pointer-events-none opacity-50';

// Shared by both listings: the row is useless on a single page, so it hides
// itself, and the links carry every other query parameter through unchanged.
export const Paginator = ({ page, pages }: PaginatorProps) => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();

    if (pages <= 1) {
        return null;
    }

    const isFirst = page <= 1;
    const isLast = page >= pages;

    return (
        // On a phone three controls do not fit side by side with their labels, so
        // the words give way and the arrows stay: the row keeps its shape instead
        // of pushing the status text out of the line.
        <Pagination className="justify-center sm:justify-end">
            <PaginationContent className="flex-wrap justify-center gap-2 sm:flex-nowrap sm:gap-1">
                <PaginationItem>
                    <PaginationLink
                        asChild
                        aria-label={t('common.previousPage')}
                        aria-disabled={isFirst || undefined}
                        tabIndex={isFirst ? -1 : undefined}
                        size="sm"
                        className={cn(
                            'shrink-0 gap-1 px-2.5 sm:px-4',
                            isFirst && disabledControl
                        )}
                    >
                        <Link
                            to={{
                                search: pageSearch(
                                    searchParams,
                                    Math.max(page - 1, 1)
                                ),
                            }}
                        >
                            <CaretLeftIcon />
                            <span className="hidden sm:inline">
                                {t('common.previous')}
                            </span>
                        </Link>
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <span
                        aria-current="page"
                        data-slot="pagination-status"
                        // No letter spacing and a smaller size on a phone: the
                        // status is the widest single piece of the row.
                        className="whitespace-nowrap px-1 text-[0.65rem] font-semibold tracking-normal uppercase tabular-nums sm:px-3 sm:text-xs sm:tracking-widest"
                    >
                        {t('common.pageOf', { page, pages })}
                    </span>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink
                        asChild
                        aria-label={t('common.nextPage')}
                        aria-disabled={isLast || undefined}
                        tabIndex={isLast ? -1 : undefined}
                        size="sm"
                        className={cn(
                            'shrink-0 gap-1 px-2.5 sm:px-4',
                            isLast && disabledControl
                        )}
                    >
                        <Link
                            to={{
                                search: pageSearch(
                                    searchParams,
                                    Math.min(page + 1, pages)
                                ),
                            }}
                        >
                            <span className="hidden sm:inline">
                                {t('common.next')}
                            </span>
                            <CaretRightIcon />
                        </Link>
                    </PaginationLink>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

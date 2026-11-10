import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import { cn } from 'cn';
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
    const [searchParams] = useSearchParams();

    if (pages <= 1) {
        return null;
    }

    const isFirst = page <= 1;
    const isLast = page >= pages;

    return (
        <Pagination className="justify-end">
            <PaginationContent>
                <PaginationItem>
                    <PaginationLink
                        asChild
                        aria-label="Go to previous page"
                        aria-disabled={isFirst || undefined}
                        tabIndex={isFirst ? -1 : undefined}
                        size="sm"
                        className={cn('gap-1', isFirst && disabledControl)}
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
                            Previous
                        </Link>
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <span
                        aria-current="page"
                        data-slot="pagination-status"
                        className="px-3 text-xs font-semibold tracking-widest uppercase"
                    >
                        Page {page} of {pages}
                    </span>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink
                        asChild
                        aria-label="Go to next page"
                        aria-disabled={isLast || undefined}
                        tabIndex={isLast ? -1 : undefined}
                        size="sm"
                        className={cn('gap-1', isLast && disabledControl)}
                    >
                        <Link
                            to={{
                                search: pageSearch(
                                    searchParams,
                                    Math.min(page + 1, pages)
                                ),
                            }}
                        >
                            Next
                            <CaretRightIcon />
                        </Link>
                    </PaginationLink>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

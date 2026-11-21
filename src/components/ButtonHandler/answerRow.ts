/**
 * The one class string for an answer row, in every mode.
 *
 * shadcn's `Button` base is a nowrap, fixed-height control — right for a
 * toolbar, wrong for an answer: a Polish answer that does not fit makes the
 * button grow wider than the grid cell, and with it the grid and the page. It
 * looked worst in the result review, where rows are rendered in the finished
 * mode and had no wrapping overrides at all.
 *
 * `whitespace-normal` wraps the text, `h-auto` lets the row grow in height,
 * `min-w-0` stops an unbreakable word from holding the column open.
 */
export const answerRowClass =
    'h-auto min-h-14 w-full min-w-0 justify-start py-3 text-left text-base leading-snug whitespace-normal';

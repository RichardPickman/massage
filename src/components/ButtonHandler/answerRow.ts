/**
 * The one class string for an answer row, in every mode.
 *
 * shadcn's `Button` base is a nowrap, fixed-height control — right for a
 * toolbar, wrong for an answer: a Polish answer that does not fit makes the
 * button grow wider than the grid cell, and with it the grid and the page. It
 * looked worst in the result review, where rows are rendered in the finished
 * mode and had no wrapping overrides at all.
 *
 * It is also set in capitals with wide letter spacing by that base, which is a
 * micro-label recipe: at 16px a Polish phrase of twenty-odd characters reads
 * letter by letter and takes a third more width than it needs. An answer is
 * content, so it drops the capitals and the spacing, carries its weight through
 * `font-medium` instead, and keeps a 48px floor — above the 44px touch minimum
 * but shorter than the 56px it used to be, because a one-line answer was padded.
 *
 * `whitespace-normal` wraps the text, `h-auto` lets the row grow in height,
 * `min-w-0` stops an unbreakable word from holding the column open.
 */
export const answerRowClass =
    'h-auto min-h-12 w-full min-w-0 justify-start px-4 py-2.5 text-left text-[0.9375rem] font-medium leading-snug whitespace-normal normal-case tracking-normal';

/**
 * Laying a microsite's grids out by hand, so they hold whatever gutter the
 * page puts around them.
 *
 * Percentage widths plus a gap do not survive a narrow screen: three tiles at
 * 31.33% and two 10pt gaps come to just over the row on a small phone, and the
 * third drops to the next line. Rows of flexed cells have no such arithmetic.
 */

/** Splits items into rows of `size`; the last row may be short. */
export const chunk = <T,>(items: T[], size: number): T[][] => {
  const rows: T[][] = [];
  const perRow = Math.max(1, size);

  for (let index = 0; index < items.length; index += perRow) {
    rows.push(items.slice(index, index + perRow));
  }

  return rows;
};

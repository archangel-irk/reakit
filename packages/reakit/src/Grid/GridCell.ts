import { createComponent } from "reakit-system/createComponent";
import { createHook } from "reakit-system/createHook";
import {
  CompositeItemOptions,
  CompositeItemHTMLProps,
  useCompositeItem,
} from "../Composite/CompositeItem";
import { unstable_useGridState as useGridState } from "./GridState";

export type unstable_GridCellOptions = CompositeItemOptions;

export type unstable_GridCellHTMLProps = CompositeItemHTMLProps;

export type unstable_GridCellProps = unstable_GridCellOptions &
  unstable_GridCellHTMLProps;

export const unstable_useGridCell = createHook<
  unstable_GridCellOptions,
  unstable_GridCellHTMLProps
>({
  name: "GridCell",
  compose: useCompositeItem,
  useState: useGridState,
});

export const unstable_GridCell = createComponent({
  as: "span",
  memo: true,
  useHook: unstable_useGridCell,
});

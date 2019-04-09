import * as React from "react";
import { warning } from "../__utils/warning";
import { mergeProps } from "../utils/mergeProps";
import { Keys } from "../__utils/types";
import { unstable_createComponent } from "../utils/createComponent";
import { unstable_useCreateElement } from "../utils/useCreateElement";
import { unstable_useOptions } from "../system/useOptions";
import { unstable_useProps } from "../system/useProps";
import {
  unstable_PopoverOptions,
  unstable_PopoverProps,
  usePopover
} from "../Popover/Popover";
import {
  unstable_StaticMenuOptions,
  unstable_StaticMenuProps,
  unstable_useStaticMenu
} from "./StaticMenu";
import { useMenuState } from "./MenuState";
import { MenuContext } from "./__utils/MenuContext";

export type unstable_MenuOptions = unstable_PopoverOptions &
  unstable_StaticMenuOptions;

export type unstable_MenuProps = unstable_PopoverProps &
  unstable_StaticMenuProps;

export function useMenu(
  options: unstable_MenuOptions,
  htmlProps: unstable_MenuProps = {}
) {
  const parent = React.useContext(MenuContext);
  const parentIsHorizontal = parent && parent.orientation === "horizontal";

  let _options: unstable_MenuOptions = {
    unstable_autoFocusOnShow: !parent,
    unstable_autoFocusOnHide: !parentIsHorizontal,
    ...options,
    unstable_modal: false,
    // We'll handle esc differently
    unstable_hideOnEsc: false
  };

  _options = unstable_useOptions("useMenu", _options, htmlProps);

  htmlProps = mergeProps(
    {
      role: "menu",
      onKeyDown: event => {
        if (event.key === "Escape" && _options.hide) {
          // Only stop propagtion if there's no parent menu
          // Otherwise, pressing Esc should close all menus
          if (!parent) {
            event.stopPropagation();
          }
          _options.hide();
        }
      }
    } as typeof htmlProps,
    htmlProps
  );

  htmlProps = unstable_useStaticMenu(_options, htmlProps);
  htmlProps = usePopover(_options, htmlProps);
  htmlProps = unstable_useProps("useMenu", _options, htmlProps);
  return htmlProps;
}

const keys: Keys<unstable_MenuOptions> = [
  ...usePopover.__keys,
  ...unstable_useStaticMenu.__keys,
  ...useMenuState.__keys
];

useMenu.__keys = keys;

export const Menu = unstable_createComponent({
  as: "div",
  useHook: useMenu,
  useCreateElement: (type, props, children) => {
    warning(
      !props["aria-label"] && !props["aria-labelledby"],
      `You should provide either \`aria-label\` or \`aria-labelledby\` props.
See https://www.w3.org/TR/wai-aria-practices-1.1/#wai-aria-roles-states-and-properties-13`,
      "Menu"
    );
    return unstable_useCreateElement(type, props, children);
  }
});
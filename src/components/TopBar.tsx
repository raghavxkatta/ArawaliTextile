import { Fragment } from "react";
import { content } from "@/data/content";

export function TopBar() {
  return (
    <div className="bg-maroon py-[9px] text-center text-[12px] font-semibold tracking-[0.16em] text-on-maroon">
      {content.topBar.map((item, i) => (
        <Fragment key={item}>
          {i > 0 && (
            <span className="mx-2.5 text-gold" aria-hidden="true">
              ✦
            </span>
          )}
          {item}
        </Fragment>
      ))}
    </div>
  );
}

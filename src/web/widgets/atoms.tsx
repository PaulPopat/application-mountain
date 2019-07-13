import React, { SFC } from "react";
import { Fade } from "./animations";
import { Spinner } from "./icons";

export const Loading: SFC<{ show: boolean }> = p => (
  <Fade show={p.show} fill overlay>
    <div className="loading-container fill">
      <Spinner fill="rgba(255, 255, 255, 0.8)" width="200px" height="200px" />
    </div>
  </Fade>
);

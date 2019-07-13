import React, { SFC } from "react";

export const Modal: SFC<{ onHide: () => void }> = p => (
  <div className="modal is-active">
    <div className="modal-background" />
    <div className="modal-content">
      <div className="box">{p.children}</div>
    </div>
    <button
      className="modal-close is-large"
      aria-label="close"
      onClick={p.onHide}
    />
  </div>
);

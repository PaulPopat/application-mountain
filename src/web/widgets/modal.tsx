import React, { Component } from "react";
import { Fade } from "./animations";

type ModalProps = { show: boolean; onHide: () => void };

export class Modal extends Component<ModalProps, { shown: boolean }> {
  public componentWillMount() {
    this.setState({ shown: this.props.show });
  }

  public componentDidUpdate(prevProps: ModalProps) {
    if (
      prevProps.show !== this.props.show &&
      this.state.shown !== this.props.show
    ) {
      this.setState({ shown: this.props.show });
    }
  }

  public render() {
    return (
      <Fade
        show={this.state.shown}
        finished={shown => {
          if (!shown) this.props.onHide();
        }}
        overlay
      >
        <div className="modal is-active">
          <div className="modal-background" />
          <div className="modal-content">
            <div className="box">{this.props.children}</div>
          </div>
          <button
            className="modal-close is-large"
            aria-label="close"
            onClick={e => this.setState({ shown: false })}
          />
        </div>
      </Fade>
    );
  }
}

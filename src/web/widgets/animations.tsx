import React, { Component, SFC } from "react";
import { build_classes } from "../../util/html_utils";

type TransitionState = "hidden" | "showing" | "shown" | "hiding";

type TransitionProps = {
  timeout: number;
  show: boolean;
  children: (state: TransitionState) => JSX.Element;
};

class Transition extends Component<
  TransitionProps,
  { state: TransitionState | "fully-hidden" }
> {
  private trigger() {
    if (this.props.show) {
      setTimeout(() => {
        this.setState({ state: "hidden" });
        setTimeout(() => {
          this.setState({ state: "showing" });
          setTimeout(() => {
            this.setState({ state: "shown" });
          }, this.props.timeout);
        }, this.props.timeout);
      }, 1);
    } else {
      setTimeout(() => {
        this.setState({ state: "hiding" });
        setTimeout(() => {
          this.setState({ state: "hidden" });
          setTimeout(() => {
            this.setState({ state: "fully-hidden" });
          }, 1);
        }, this.props.timeout);
      }, this.props.timeout);
    }
  }

  public componentDidMount() {
    this.trigger();
  }

  public componentDidUpdate(prevProps: TransitionProps) {
    if (prevProps.show === this.props.show) {
      return;
    }

    this.trigger();
  }

  public render() {
    if (!this.state || this.state.state === "fully-hidden") {
      return <></>;
    }

    return this.props.children(this.state.state);
  }
}

export const Fade: SFC<{
  fill?: boolean;
  show: boolean;
  overlay?: boolean;
}> = p => (
  <Transition timeout={250} show={p.show}>
    {s => (
      <div
        className={build_classes({ [s]: true, fade: true, fill: p.fill })}
        style={
          p.overlay
            ? {
                position: "absolute",
                top: 0,
                left: 0
              }
            : {}
        }
      >
        {p.children}
      </div>
    )}
  </Transition>
);

import React, { Component, SFC } from "react";
import { build_classes } from "../../util/html_utils";

type TransitionState = "hidden" | "showing" | "shown" | "hiding";

type TransitionProps = {
  timeout: number;
  show: boolean;
  finished?: (shown: boolean) => void;
  children: (state: TransitionState) => JSX.Element;
};

class Transition extends Component<
  TransitionProps,
  { state: TransitionState | "fully-hidden" }
> {
  public constructor(props: TransitionProps, context: any) {
    super(props, context);
    this.state = {
      state: props.show ? "hidden" : "fully-hidden"
    };
  }

  private timeouts: any[] = [];
  private trigger() {
    if (this.props.show) {
      const t1 = setTimeout(() => {
        this.setState({ state: "hidden" });
        const t2 = setTimeout(() => {
          this.setState({ state: "showing" });
          const t3 = setTimeout(() => {
            this.setState({ state: "shown" });
            this.props.finished && this.props.finished(true);
            clearTimeout(t3);
            this.timeouts = this.timeouts.filter(t => t !== t3);
          }, this.props.timeout);
          this.timeouts.push(t3);
          clearTimeout(t2);
          this.timeouts = this.timeouts.filter(t => t !== t2);
        }, this.props.timeout);
        this.timeouts.push(t2);
        clearTimeout(t1);
        this.timeouts = this.timeouts.filter(t => t !== t1);
      }, 1);
      this.timeouts.push(t1);
    } else {
      const t1 = setTimeout(() => {
        this.setState({ state: "hiding" });
        const t2 = setTimeout(() => {
          this.setState({ state: "hidden" });
          const t3 = setTimeout(() => {
            this.setState({ state: "fully-hidden" });
            this.props.finished && this.props.finished(false);
            clearTimeout(t3);
            this.timeouts = this.timeouts.filter(t => t !== t3);
          }, 1);
          this.timeouts.push(t3);
          clearTimeout(t2);
          this.timeouts = this.timeouts.filter(t => t !== t2);
        }, this.props.timeout);
        this.timeouts.push(t2);
        clearTimeout(t1);
        this.timeouts = this.timeouts.filter(t => t !== t1);
      }, this.props.timeout);
      this.timeouts.push(t1);
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

  public componentWillUnmount() {
    for (const timeout of this.timeouts) {
      clearTimeout(timeout);
    }
  }

  public render() {
    if (this.state.state === "fully-hidden") {
      return <></>;
    }

    return this.props.children(this.state.state);
  }
}

export const Fade: SFC<{
  fill?: boolean;
  finished?: (shown: boolean) => void;
  show: boolean;
  overlay?: boolean;
  "flex-fill"?: boolean;
}> = p => (
  <Transition timeout={150} show={p.show} finished={p.finished}>
    {s => (
      <div
        className={build_classes({
          [s]: true,
          fade: true,
          fill: p.fill,
          "flex-fill": p["flex-fill"]
        })}
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

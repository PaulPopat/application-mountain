import React, { Component } from "react";
import { Fade } from "./animations";

export class Carousel extends Component<
  { interval: number; paths: string[]; children?: never[] | null },
  { current: number }
> {
  private timeout: any;

  public constructor(props: any, context: any) {
    super(props, context);
    this.state = {
      current: 0
    };
  }

  public componentDidMount() {
    this.timeout = setInterval(() => {
      this.setState(s => ({
        ...s,
        current: s.current === this.props.paths.length - 1 ? 0 : s.current + 1
      }));
    }, this.props.interval);
  }

  public componentWillUnmount() {
    clearInterval(this.timeout);
  }

  public render() {
    return (
      <div className="carousel">
        {this.props.paths.map((p, i) => (
          <Fade key={p} show={i === this.state.current}>
            <img src={p} />
          </Fade>
        ))}
      </div>
    );
  }
}

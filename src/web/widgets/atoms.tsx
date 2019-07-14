import React, { SFC } from "react";
import { Fade } from "./animations";
import { Spinner } from "./icons";
import { build_classes } from "../../util/html_utils";

export const Loading: SFC<{
  loading: boolean;
  width?: string;
  height?: string;
  fill?: string;
}> = p => (
  <>
    <Fade show={p.loading} fill overlay>
      <div
        className="loading-container fill"
        style={{ width: p.width, height: p.height }}
      >
        <Spinner
          fill={p.fill || "rgba(255, 255, 255, 0.8)"}
          width="200px"
          height="200px"
        />
      </div>
    </Fade>
    <Fade show={!p.loading} fill overlay>
      {p.children}
    </Fade>
  </>
);

export const Columns: SFC = p => (
  <div className="columns">
    {React.Children.map(p.children, (n, i) => (
      <div className="column" key={i}>
        {n}
      </div>
    ))}
  </div>
);

export const Container: SFC = p => (
  <div className="container">{p.children}</div>
);

export const Section: SFC = p => (
  <section className="section">
    <Container>{p.children}</Container>
  </section>
);

export const Field: SFC = p => <div className="field">{p.children}</div>;

export const Buttons: SFC = p => <div className="buttons">{p.children}</div>;

export const Heading: SFC<{
  subtitle?: boolean;
  level: "1" | "2" | "3" | "4" | "5" | "6";
  spaced?: boolean;
}> = p => (
  <p
    className={build_classes({
      title: !p.subtitle,
      subtitle: p.subtitle,
      [`is-${p.level}`]: true,
      "is-spaced": p.spaced
    })}
  >
    {p.children}
  </p>
);

type ButtonProps = {
  type?:
    | "primary"
    | "link"
    | "info"
    | "success"
    | "warning"
    | "danger"
    | "white"
    | "light"
    | "dark"
    | "black"
    | "text";
  outlined?: boolean;
  inverted?: boolean;
  "full-width"?: boolean;
  size?: "small" | "normal" | "medium" | "large";
  rounded?: boolean;
  loading?: boolean;
  disabled?: boolean;
};

function buildClasses(props: ButtonProps) {
  return build_classes({
    button: true,
    [`is-${props.type}`]: props.type != null,
    [`is-${props.size}`]: props.size != null,
    "is-fullwidth": props["full-width"],
    "is-outlined": props.outlined,
    "is-inverted": props.inverted,
    "is-rounded": props.rounded,
    "is-loading": props.loading
  });
}

export const Button: React.SFC<
  { onClick: () => void } & ButtonProps
> = props => (
  <div
    className={buildClasses(props)}
    onClick={props.onClick}
    {...{ disabled: props.disabled }}
  >
    {props.children}
  </div>
);

import React, { SFC, useState } from "react";
import { Fade } from "./animations";
import { Spinner, Chevron } from "./icons";
import { build_classes } from "../../util/html_utils";

export const Loading: SFC<{
  loading: boolean;
  width?: string;
  height?: string;
  fill?: string;
  "flex-fill"?: boolean;
}> = p => (
  <>
    <Fade
      show={!p.loading}
      fill={!p["flex-fill"]}
      overlay={!p["flex-fill"]}
      flex-fill={p["flex-fill"]}
    >
      {p.children}
    </Fade>
    <Fade
      show={p.loading}
      fill={!p["flex-fill"]}
      overlay={!p["flex-fill"]}
      flex-fill={p["flex-fill"]}
    >
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
  title?: string;
}> = p => (
  <p
    className={build_classes({
      title: !p.subtitle,
      subtitle: p.subtitle,
      [`is-${p.level}`]: true,
      "is-spaced": p.spaced
    })}
    title={p.title}
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
  { onClick: () => void; onBlur?: () => void } & ButtonProps
> = props => (
  <button
    className={buildClasses(props)}
    onClick={props.onClick}
    onBlur={props.onBlur}
    disabled={props.disabled}
  >
    {props.children}
  </button>
);

export const Tag: React.SFC<{
  colour?:
    | "black"
    | "dark"
    | "light"
    | "white"
    | "primary"
    | "link"
    | "info"
    | "success"
    | "warning"
    | "danger";
  size?: "normal" | "medium" | "large";
  rounded?: boolean;
  onClick?: () => void;
  "is-delete"?: boolean;
}> = p => {
  const classes = build_classes({
    tag: true,
    [`is-${p.colour}`]: p.colour != null,
    [`is-${p.size}`]: p.size != null,
    "is-rounded": p.rounded,
    "is-delete": p["is-delete"]
  });
  return p.onClick ? (
    <a href="javascript:void(0);" onClick={p.onClick} className={classes}>
      {p.children}
    </a>
  ) : (
    <div className={classes}>{p.children}</div>
  );
};

export const Tags: React.SFC<{
  "has-addons"?: boolean;
}> = p => (
  <div
    className={build_classes({
      tags: true,
      "has-addons": p["has-addons"]
    })}
  >
    {p.children}
  </div>
);

export const DropdownItem: SFC<{
  active?: boolean;
  onClick: () => void;
}> = p => (
  <a
    href="#"
    className={build_classes({ "dropdown-item": true, "is-active": p.active })}
    onClick={p.onClick}
  >
    {p.children}
  </a>
);

export const DropdownDivider: SFC<{ children?: never[] | null }> = p => (
  <hr className="dropdown-divider" />
);

export const Dropdown: SFC<
  {
    id: string;
    hover?: boolean;
    children: {
      title: React.ReactNode;
      content: React.ReactNode;
    };
  } & ButtonProps
> = p => {
  const [open, set_open] = useState(false);

  if (p.disabled && open) {
    set_open(false);
  }

  return (
    <div
      className={build_classes({
        dropdown: true,
        "is-hoverable": p.hover,
        "is-active": open && !p.disabled
      })}
    >
      <div className="dropdown-trigger">
        <Button onClick={() => set_open(!open)} {...p}>
          <span>{p.children.title}</span>
          <span className="icon is-small">
            <Chevron.Down width="1.5em" height="1.5em" fill="#fff" />
          </span>
        </Button>
      </div>
      <div className="dropdown-menu" id={p.id} role="menu">
        <div className="dropdown-content" onClick={() => set_open(false)}>
          {p.children.content}
        </div>
      </div>
    </div>
  );
};

export const CardFooterItem: SFC<{ onClick: () => void }> = p => (
  <a href="#" onClick={p.onClick} className="card-footer-item">
    {p.children}
  </a>
);

export const Card: SFC<{
  children: {
    header: React.ReactNode;
    content: React.ReactNode;
    footer?: React.ReactNode;
  };
}> = p => (
  <div className="card">
    <header className="card-header">
      <p className="card-header-title">{p.children.header}</p>
    </header>
    <div className="card-content">
      <div className="content">{p.children.content}</div>
    </div>
    {p.children.footer && (
      <footer className="card-footer">{p.children.footer}</footer>
    )}
  </div>
);

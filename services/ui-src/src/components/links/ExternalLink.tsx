import { Link, LinkProps, SystemStyleObject } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@cmsgov/design-system";
import { MouseEvent, useState } from "react";
import {
  isSessionVisitedLink,
  markSessionVisitedLink,
} from "utils/other/sessionVisitedLinks";
import { externalLinkAltText } from "../../constants";

const externalLinkStyles: SystemStyleObject = {
  // Browser :visited cannot be cleared on logout, so reset it here.
  _visited: {
    color: "primary",
    textDecorationColor: "primary",
  },
  "&.is-session-visited": {
    color: "visited",
    textDecorationColor: "visited",
  },
};

export const ExternalLink = ({
  href,
  className,
  onClick,
  sx,
  children,
  ...props
}: LinkProps) => {
  const hrefValue = typeof href === "string" ? href : "";
  const [isSessionVisited, setIsSessionVisited] = useState(
    () => !!hrefValue && isSessionVisitedLink(hrefValue)
  );

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (hrefValue) {
      markSessionVisitedLink(hrefValue);
      setIsSessionVisited(true);
    }
    onClick?.(event);
  };

  return (
    <Link
      {...props}
      href={href}
      target="_blank"
      className={[className, isSessionVisited ? "is-session-visited" : ""]
        .filter(Boolean)
        .join(" ")}
      onClick={handleClick}
      sx={{ ...externalLinkStyles, ...sx }}
    >
      {children}{" "}
      <ExternalLinkIcon
        ariaHidden={false}
        title={externalLinkAltText}
        className="external-link-icon"
      />
    </Link>
  );
};

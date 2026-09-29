import { Alert } from "components";
import { BannerFormData } from "@pasrr/shared";
import { parseHtml } from "utils";

export const Banner = ({ title, description, link }: Props) => {
  return (
    <Alert title={title} link={link}>
      {parseHtml(description)}
    </Alert>
  );
};

type Props = Pick<BannerFormData, "title" | "description" | "link">;

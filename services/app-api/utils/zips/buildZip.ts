import {
  AccordionGroupTemplate,
  ElementType,
  AttachmentAreaTemplate,
  Report,
  PageElement,
} from "@pasrr/shared";
import s3Lib from "../../libs/s3-lib";
import JSZip from "jszip";

export const formatS3ZipKey = (zipId: string) => `zips/${zipId}.zip`;

// sort relevant elements into an object to organize better
export const sortElementsForZip = (report: Report) =>
  report?.pages
    .flatMap((page) => page.elements)
    .reduce(
      (
        acc: {
          accordions: AccordionGroupTemplate[];
          area: AttachmentAreaTemplate[];
        },
        curr
      ) => {
        if (curr?.type === ElementType.AccordionGroup) {
          acc.accordions.push(curr);
        } else if (curr?.type === ElementType.AttachmentArea) {
          acc.area.push(curr);
        }
        return acc;
      },
      { accordions: [], area: [] }
    );

export const getAccordionFiles = (elements: AccordionGroupTemplate[]) => {
  const elementList = elements.flatMap((group) =>
    group.accordions.flatMap((accordions) => accordions.elements)
  ) as PageElement[];
  return getAttachmentAreaFiles(elementList);
};

export const getAttachmentAreaFiles = (elements: PageElement[]) =>
  elements
    .filter((element) => element.type === ElementType.AttachmentArea)
    .filter((element) => "answer" in element)
    .flatMap((group) => group.answer);

export const addReportFilesToZip = async (report: Report, zip: JSZip) => {
  const { id, type: reportType, state } = report;
  const sortedElements = sortElementsForZip(report);
  // TODO: organize zip folders to match the PASRR report's pages once the
  // PASRR report schema is defined.
  const zipFolders = [
    {
      name: "Attachments",
      files: [
        ...getAccordionFiles(sortedElements?.accordions),
        ...getAttachmentAreaFiles(
          sortedElements?.area as unknown as PageElement[]
        ),
      ],
    },
  ];

  for (const folder of zipFolders) {
    for (const file of folder.files) {
      const item = await s3Lib.getObject({
        Bucket: process.env.attachmentsBucketName,
        Key: `${reportType}/${state}/${id}/${file?.fileId}`,
      });
      const bytes = await item.Body?.transformToByteArray();
      if (bytes && file?.name) {
        zip.file(
          `${state}/${report?.subType.toUpperCase()}/${folder.name}/${file.name}`,
          bytes
        );
      }
    }
  }
};

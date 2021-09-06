import PdfPrinter from "pdfmake";
import fs from "fs-extra";
import { Buffer } from "buffer";

const fonts = {
  Roboto: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
};

function base64_encode(file) {
  var bitmap = fs.readFileSync(file);
  return new Buffer(bitmap).toString("base64");
}

const printer = new PdfPrinter(fonts);

export const getPDFReadableStream = (user) => {
  const docDefinition = {
    content: [
      /* { image: `${base64_encode(user.image)}` }, */
      { text: user.name + " " + user.surname, style: "header" },
      { text: user.email, style: "subheader" },
      { text: user.bio, style: "small" },
    ],
    styles: {
      header: { fontSize: 18, bold: true },
      subheader: { fontSize: 15, bold: true },
      small: { fontSize: 8 },
    },
  };
  const options = {};
  const pdfReadableStream = printer.createPdfKitDocument(
    docDefinition,
    options
  );
  pdfReadableStream.end();
  return pdfReadableStream;
};

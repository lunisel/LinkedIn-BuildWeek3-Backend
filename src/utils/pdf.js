import PdfPrinter from "pdfmake";
import axios from "axios";

const fonts = {
  Roboto: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
};

const printer = new PdfPrinter(fonts);

export const getPDFReadableStream = async (user) => {
  const response = await axios.get(user.image, { responseType: "arraybuffer" });
  const imageUrl = user.image.split("/");
  const fileName = imageUrl[imageUrl.length - 1];
  const [id, extention] = fileName.split(".");
  const base64 = response.data.toString("base64");
  console.log("Response ------->", response);
  const base64Image = `data:image/${extention};base64,${base64}`;
  const imagePart = { image: base64Image, width: 500 };

  const docDefinition = {
    content: [
      imagePart,
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

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  return pdfDoc;
};

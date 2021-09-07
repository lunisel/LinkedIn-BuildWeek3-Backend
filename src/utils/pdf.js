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
  const base64Image = `data:image/${extention};base64,${base64}`;

  const userExperiences = user.experiences.map((e) => e);

  function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  const docDefinition = {
    content: [
      { text: `Curriculum Vitae`, style: "header" },

      // Horizontal Line
      {
        table: {
          widths: ["*"],
          body: [[" "], [" "]],
        },
        layout: {
          hLineWidth: function (i, node) {
            return i === 0;
          },
          vLineWidth: function (i, node) {
            return 0;
          },
        },
      },

      {
        columns: [
          {
            width: "auto",
            text: "Name:\nSurname:\nEmail:\nArea:\nBio:",
            style: "subheader",
          },
          {
            width: "auto",
            text: `-------`,
            style: "space",
          },
          {
            width: "*",
            text: ` ${user.name}\n ${user.surname}\n ${user.email}\n ${user.area}\n ${user.bio}`,
            style: "text",
          },
          {
            width: "150",
            image: base64Image,
          },
        ],
      },

      { text: "EXPERIENCES", style: "smallHeader" },

      // Horizontal Line
      {
        table: {
          widths: ["*"],
          body: [[" "], [" "]],
        },
        layout: {
          hLineWidth: function (i, node) {
            return i === 0;
          },
          vLineWidth: function (i, node) {
            return 0;
          },
        },
      },

      userExperiences.map(function (exp) {
        return {
          columns: [
            {
              width: "auto",
              text: "Role:\nCompany:\nStart Date:\nEnd Date:\nDescription:",
              style: "subheader",
            },
            {
              width: "auto",
              text: `-------`,
              style: "space",
            },
            {
              width: "*",
              text: ` ${exp.role}\n ${exp.company}\n ${convert(
                exp.startDate
              )}\n ${convert(exp.endDate)}\n ${exp.description}`,
              style: "text",
            },
          ],
          style: "marginCol",
        };
      }),
    ],

    styles: {
      header: {
        fontSize: 26,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 5],
      },
      subheader: { fontSize: 15, bold: true, lineHeight: 2 },
      text: { fontSize: 15, bold: false, lineHeight: 2 },
      space: { fontSize: 15, color: "white" },
      smallHeader: {
        fontSize: 16,
        bold: true,
        lineHeight: 2,
        margin: [0, 20, 0, 0],
      },
      marginCol: { margin: [0, 0, 0, 30] },
    },
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.end();
  return pdfDoc;
};

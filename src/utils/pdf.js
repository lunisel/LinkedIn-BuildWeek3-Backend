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
  const imagePart = { image: base64Image, width: 200 };
  
  const userExperiences = user.experiences.map(e => `[${e.company}, {text: ${e.area}, alignment: 'right'}],
  ['Your degree and your major', {text: 'Years Attended', alignment: 'right'}],`)
  console.log(userExperiences) 

  const docDefinition = {
    content: [
        { text: user.name + " " + user.surname, style: 'header' }, 
        // 'Address.\n' + user.email + '.\n' + user.bio + '.\n\n',
        {
          columns: [
            {
              width: '*',
              text: user.area + '\n' + user.email + '.\n' + user.title + '\n\n' + user.bio + '.\n\n',
              style: 'subheader'
            },
            {
              width: '200',
              image: base64Image
            }
          ]
        },
            {
              table: {
              headerRows: 1,
              widths: ['*','*'],
                body: [
                  [{text: '\nEDUCATION', style: 'subheader'}, {text: ''}],
                  ['College #1', {text: 'Location', alignment: 'right'}],
                  ['Your degree and your major', {text: 'Years Attended', alignment: 'right'}],
                  ['College #2', {text: 'Location', alignment: 'right'}],
                  ['Your degree and your major', {text: 'Years Attended', alignment: 'right'}]
                ]
              },
              layout: 'headerLineOnly'
            },
          {
              table: {
              headerRows: 1,
              widths: ['*','*'],
                body: [
                  [{text: '\nEXPERIENCE', style: 'subheader'}, {text: ''}],
                  // userExperiences // Cannot read property '_calcWidth' of undefined

                  // ['College #1', {text: 'Location', alignment: 'right'}],
                  // ['Your degree and your major', {text: 'Years Attended', alignment: 'right'}],
                  // ['College #2', {text: 'Location', alignment: 'right'}],
                  // ['Your degree and your major', {text: 'Years Attended', alignment: 'right'}]
                ]
              },
              layout: 'headerLineOnly'
            },
          {
              table: {
              headerRows: 1,
              widths: ['*','*'],
                body: [
                  [{text: '\nPROJECTS', style: 'subheader'}, {text: ''}],
                  ['College #1', {text: 'Location', alignment: 'right'}],
                  ['Your degree and your major', {text: 'Years Attended', alignment: 'right'}],
                  ['College #2', {text: 'Location', alignment: 'right'}],
                  ['Your degree and your major', {text: 'Years Attended', alignment: 'right'}]
                ]
              },
              layout: 'headerLineOnly'
            },
      ],
      styles: {
        header: { fontSize: 26, bold: true },
        subheader: { fontSize: 15, bold: true },
        quote: { italics: true },
        small: { fontSize: 8 },
        superMargin: { margin: [20, 0, 40, 0] },
      }	
  }

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.end();
  return pdfDoc;
};
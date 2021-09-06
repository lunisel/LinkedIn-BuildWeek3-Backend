import PdfPrinter from "pdfmake";
import { pipeline } from "stream";
import fs from "fs-extra";

const { createWriteStream } = fs 

const fonts = {
  Roboto: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique"
  }
}

const printer = new PdfPrinter(fonts)

export const getPDFReadableStream = (user) => {
  const docDefinition = {
    content: [
      {text: user.name,style: 'header'}
    //   {text: `\nby ${blog.author.name}`,style: 'subheader'},     
    // //   `\n${striptags(blog.content)}`,
    //   {text: `\n\nCREATED AT ${new Date(blog.createdAt)}`,style: 'small'}
    ],
    styles: {
      header: {fontSize: 18,bold: true}
    //   subheader: {fontSize: 15,bold: true},
    //   small: {fontSize: 8}
    }
  }
  const options = {}
  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, options)
  pdfReadableStream.end()
  return pdfReadableStream 
}
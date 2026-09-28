import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =========================================================
// FILE PATHS
// =========================================================

const dubaiBoldPath = path.join(
  __dirname,
  "../fonts/Dubai-Bold.ttf"
);

const dubaiRegularPath = path.join(
  __dirname,
  "../fonts/Dubai-Regular.ttf"
);

const dubaiMediumPath = path.join(
  __dirname,
  "../fonts/Dubai-Medium.ttf"
);

const calibriPath = path.join(
  __dirname,
  "../fonts/calibri.ttf"
);

const bridgePath = path.join(
  __dirname,
  "../assets/bridge.png"
);

const stampPath = path.join(
  __dirname,
  "../assets/TMT-Stamp.png"
);

const thicknessPath = path.join(
  __dirname,
  "../assets/12m.png"
);

const bottomPath = path.join(
  __dirname,
  "../assets/bottom.png"
);

const footerDetailPath = path.join(
  __dirname,
  "../assets/footer-detail.png"
);

const homeDeliveryPath = path.join(
  __dirname,
  "../assets/home-delivery.png"
);

const pricePath = path.join(
  __dirname,
  "../assets/price.png"
);

const telephonePath = path.join(
  __dirname,
  "../assets/telephone.png"
);

const tmtBarPath = path.join(
  __dirname,
  "../assets/image.png"
);

const webPath = path.join(
  __dirname,
  "../assets/web.png"
);

const logoPath = path.join(
  __dirname,
  "../assets/logo_JSW-one.png"
);

// =========================================================
// A4
//
// Original browser design:
// 794 x 1123 px
//
// PDF points:
// A4 = 595.28 x 841.89 pt
//
// 1 px ≈ 0.75 pt
// =========================================================

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;

const PX = 0.75;

// Convert original CSS px to PDF points
const p = (value) => value * PX;

// =========================================================
// COLORS
// =========================================================

const BLUE = "#243a7c";
const TABLE_BLUE = "#3156a3";
const TEXT_BLUE = "#29457e";
const FEATURE_BLUE = "#3e5a9d";
const STATEMENT_BLUE = "#405da1";
const RED = "#e63832";
const WHITE = "#ffffff";
const BLACK = "#111111";

// =========================================================
// HELPERS
// =========================================================

function assertFile(filePath, name) {
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `${name} was not found at:\n${filePath}`
    );
  }
}

function drawImageCover(
  doc,
  imagePath,
  x,
  y,
  width,
  height
) {
  /*
   * PDFKit does not have CSS object-fit: cover.
   *
   * We use image dimensions from PDFKit internally and
   * calculate the crop ourselves.
   */

  const image = doc.openImage(imagePath);

  const imageWidth = image.width;
  const imageHeight = image.height;

  const containerRatio = width / height;
  const imageRatio = imageWidth / imageHeight;

  let drawWidth;
  let drawHeight;
  let drawX;
  let drawY;

  if (imageRatio > containerRatio) {
    // Image is wider -> crop left/right
    drawHeight = height;
    drawWidth = height * imageRatio;

    drawX =
      x - (drawWidth - width) / 2;

    drawY = y;
  } else {
    // Image is taller -> crop top/bottom
    drawWidth = width;
    drawHeight = width / imageRatio;

    drawX = x;

    drawY =
      y - (drawHeight - height) / 2;
  }

  doc.save();

  doc.rect(
    x,
    y,
    width,
    height
  ).clip();

  doc.image(
    imagePath,
    drawX,
    drawY,
    {
      width: drawWidth,
      height: drawHeight,
    }
  );

  doc.restore();
}

function drawImageContain(
  doc,
  imagePath,
  x,
  y,
  width,
  height
) {
  const image = doc.openImage(imagePath);

  const imageWidth = image.width;
  const imageHeight = image.height;

  const scale = Math.min(
    width / imageWidth,
    height / imageHeight
  );

  const drawWidth =
    imageWidth * scale;

  const drawHeight =
    imageHeight * scale;

  const drawX =
    x + (width - drawWidth) / 2;

  const drawY =
    y + (height - drawHeight) / 2;

  doc.image(
    imagePath,
    drawX,
    drawY,
    {
      width: drawWidth,
      height: drawHeight,
    }
  );
}

function drawCenteredText(
  doc,
  text,
  x,
  y,
  width,
  height,
  options = {}
) {
  const {
    font = "Helvetica",
    size = 12,
    color = BLACK,
    align = "center",
  } = options;

  doc
    .font(font)
    .fontSize(size)
    .fillColor(color);

  const textHeight =
    doc.heightOfString(text, {
      width,
      align,
    });

  const textY =
    y + (height - textHeight) / 2;

  doc.text(
    text,
    x,
    textY,
    {
      width,
      align,
      lineBreak: false,
    }
  );
}

// =========================================================
// GENERATE PDF
// =========================================================

async function generatePricePDF(data) {
  console.log(
    "Starting PDF generation with PDFKit..."
  );

  // =======================================================
  // VALIDATE DATA
  // =======================================================

  if (!data) {
    throw new Error(
      "Price data is required."
    );
  }

  if (
    !Array.isArray(data.priceList)
  ) {
    throw new Error(
      "priceList must be an array."
    );
  }

  // =======================================================
  // VALIDATE ASSETS
  // =======================================================

  assertFile(
    dubaiBoldPath,
    "Dubai-Bold.ttf"
  );

  assertFile(
    dubaiRegularPath,
    "Dubai-Regular.ttf"
  );

  assertFile(
    dubaiMediumPath,
    "Dubai-Medium.ttf"
  );

  assertFile(
    calibriPath,
    "calibri.ttf"
  );

  assertFile(
    bridgePath,
    "bridge.png"
  );

  assertFile(
    stampPath,
    "TMT-Stamp.png"
  );

  assertFile(
    thicknessPath,
    "12m.png"
  );

  assertFile(
    bottomPath,
    "bottom.png"
  );

  assertFile(
    footerDetailPath,
    "footer-detail.png"
  );

  assertFile(
    homeDeliveryPath,
    "home-delivery.png"
  );

  assertFile(
    pricePath,
    "price.png"
  );

  assertFile(
    telephonePath,
    "telephone.png"
  );

  assertFile(
    tmtBarPath,
    "image.png"
  );

  assertFile(
    webPath,
    "web.png"
  );

  assertFile(
    logoPath,
    "logo_JSW-one.png"
  );

  console.log(
    "All PDF assets found."
  );

  // =======================================================
  // CREATE DOCUMENT
  // =======================================================

  const doc =
    new PDFDocument({
      size: "A4",

      margin: 0,

      autoFirstPage: true,

      info: {
        Title:
          "JSW One TMT Consumer Price",
        Author:
          "JSW One TMT",
        Subject:
          "Recommended Consumer Price",
      },
    });

  // =======================================================
  // RETURN PDF AS BUFFER
  // =======================================================

  const chunks = [];

  doc.on(
    "data",
    (chunk) => {
      chunks.push(chunk);
    }
  );

  const pdfPromise =
    new Promise(
      (resolve, reject) => {
        doc.on(
          "end",
          () => {
            resolve(
              Buffer.concat(chunks)
            );
          }
        );

        doc.on(
          "error",
          reject
        );
      }
    );

  try {
    // =====================================================
    // PAGE BACKGROUND
    // =====================================================

    console.log(
      "Drawing page background..."
    );

    doc
      .rect(
        0,
        0,
        PAGE_WIDTH,
        PAGE_HEIGHT
      )
      .fill(BLUE);

    // =====================================================
    // BRIDGE BACKGROUND
    // =====================================================

    drawImageCover(
      doc,
      bridgePath,
      0,
      0,
      PAGE_WIDTH,
      PAGE_HEIGHT
    );

    // =====================================================
    // JSW LOGO
    //
    // Original:
    // top: 15px
    // right: 20px
    // width: 100px
    // =====================================================

    const logoWidth =
      p(100);

    const logoX =
      PAGE_WIDTH -
      p(20) -
      logoWidth;

    const logoY =
      p(15);

    drawImageContain(
      doc,
      logoPath,
      logoX,
      logoY,
      logoWidth,
      p(70)
    );

    // =====================================================
    // MAIN CONTENT
    //
    // Original content:
    //
    // left: 50%
    // top: 450px
    // width: 650px
    //
    // transform translate(-50%, -50%)
    // =====================================================

    const contentWidth =
      p(650);

    const contentX =
      (PAGE_WIDTH -
        contentWidth) /
      2;

    /*
     * Original center point:
     * top = 450px
     *
     * PDF equivalent:
     */
    const contentCenterY =
      p(450);

    // The original content starts approximately
    // around 320px after translation.
    let currentY =
      contentCenterY -
      p(110);

    // =====================================================
    // TITLE
    // =====================================================

    const title =
      "JSW One TMT Consumer Price";

    doc
      .font(dubaiBoldPath)
      .fontSize(p(37))
      .fillColor(WHITE);

    doc.text(
      title,
      contentX,
      currentY,
      {
        width: contentWidth,
        lineBreak: false,
      }
    );

    currentY +=
      p(48);

    // =====================================================
    // RED LINE
    // =====================================================

    doc
      .rect(
        contentX,
        currentY,
        p(463),
        p(5)
      )
      .fill(RED);

    currentY +=
      p(15);

    // =====================================================
    // CONTACT ROW
    // =====================================================

    const contactHeight =
      p(40);

    const webIconWidth =
      p(24);

    const telephoneIconWidth =
      p(24);

    const contactFontSize =
      p(25);

    const firstContactX =
      contentX;

    const secondContactX =
      contentX +
      p(300);

    // Website icon

    drawImageContain(
      doc,
      webPath,
      firstContactX,
      currentY,
      webIconWidth,
      contactHeight
    );

    doc
      .font(dubaiBoldPath)
      .fontSize(contactFontSize)
      .fillColor(WHITE);

    doc.text(
      "www.jswonetmt.com",
      firstContactX +
        p(30),
      currentY +
        p(3),
      {
        width: p(220),
        lineBreak: false,
      }
    );

    // Telephone icon

    drawImageContain(
      doc,
      telephonePath,
      secondContactX,
      currentY,
      telephoneIconWidth,
      contactHeight
    );

    doc.text(
      "1800 1030 663",
      secondContactX +
        p(30),
      currentY +
        p(3),
      {
        width: p(180),
        lineBreak: false,
      }
    );

    currentY +=
      p(55);

    // =====================================================
    // TMT STAMP
    //
    // Original:
    // top: -10px
    // right: -15px
    // width/height: 120px
    // =====================================================

    const stampSize =
      p(120);

    const stampX =
      contentX +
      contentWidth -
      p(120);

    const stampY =
      currentY -
      p(40);

    drawImageContain(
      doc,
      stampPath,
      stampX,
      stampY,
      stampSize,
      stampSize
    );

    // =====================================================
    // STATE
    // =====================================================

    doc
      .font(dubaiRegularPath)
      .fontSize(p(25))
      .fillColor(WHITE);

    doc.text(
      "For the state of ",
      contentX,
      currentY,
      {
        continued: true,
        lineBreak: false,
      }
    );

    doc
      .font(dubaiBoldPath)
      .fontSize(p(25))
      .fillColor(WHITE);

    doc.text(
      "Bihar",
      {
        continued: false,
        lineBreak: false,
      }
    );

    currentY +=
      p(45);

    // =====================================================
    // PRICE TABLE
    // =====================================================

    const tableWidth =
      contentWidth;

    const firstColumnWidth =
      tableWidth * 0.40;

    const secondColumnWidth =
      tableWidth * 0.60;

    const headerHeight =
      p(55);

    const rowHeight =
      p(55);

    const borderWidth =
      p(1);

    // =====================================================
    // TABLE HEADER
    // =====================================================

    doc
      .rect(
        contentX,
        currentY,
        firstColumnWidth,
        headerHeight
      )
      .fill(WHITE);

    doc
      .rect(
        contentX +
          firstColumnWidth,
        currentY,
        secondColumnWidth,
        headerHeight
      )
      .fill(WHITE);

    // Borders

    doc
      .lineWidth(borderWidth)
      .strokeColor(TABLE_BLUE);

    doc
      .rect(
        contentX,
        currentY,
        tableWidth,
        headerHeight
      )
      .stroke();

    doc
      .moveTo(
        contentX +
          firstColumnWidth,
        currentY
      )
      .lineTo(
        contentX +
          firstColumnWidth,
        currentY +
          headerHeight
      )
      .stroke();

    // Header text

    drawCenteredText(
      doc,
      "Section",
      contentX,
      currentY,
      firstColumnWidth,
      headerHeight,
      {
        font: dubaiMediumPath,
        size: p(24),
        color: TEXT_BLUE,
      }
    );

    drawCenteredText(
      doc,
      "Recommended Price (Fe 550)",
      contentX +
        firstColumnWidth,
      currentY,
      secondColumnWidth,
      headerHeight,
      {
        font: dubaiMediumPath,
        size: p(24),
        color: TEXT_BLUE,
      }
    );

    currentY +=
      headerHeight;

    // =====================================================
    // TABLE ROWS
    // =====================================================

    for (
      const item of data.priceList
    ) {
      const section =
        `${item.section} mm`;

      const price =
        `₹ ${Number(item.price)}`;

      // White cells

      doc
        .rect(
          contentX,
          currentY,
          firstColumnWidth,
          rowHeight
        )
        .fill(WHITE);

      doc
        .rect(
          contentX +
            firstColumnWidth,
          currentY,
          secondColumnWidth,
          rowHeight
        )
        .fill(WHITE);

      // Outer border

      doc
        .lineWidth(borderWidth)
        .strokeColor(TABLE_BLUE);

      doc
        .rect(
          contentX,
          currentY,
          tableWidth,
          rowHeight
        )
        .stroke();

      // Column border

      doc
        .moveTo(
          contentX +
            firstColumnWidth,
          currentY
        )
        .lineTo(
          contentX +
            firstColumnWidth,
          currentY +
            rowHeight
        )
        .stroke();

      // Section

      drawCenteredText(
        doc,
        section,
        contentX,
        currentY,
        firstColumnWidth,
        rowHeight,
        {
          font: dubaiMediumPath,
          size: p(24),
          color: BLACK,
        }
      );

      // Price

      drawCenteredText(
        doc,
        price,
        contentX +
          firstColumnWidth,
        currentY,
        secondColumnWidth,
        rowHeight,
        {
          font: dubaiMediumPath,
          size: p(24),
          color: BLACK,
        }
      );

      currentY +=
        rowHeight;
    }

    // =====================================================
    // EFFECTIVE DATE
    // =====================================================

    const effectiveHeight =
      p(44);

    doc
      .rect(
        contentX,
        currentY,
        tableWidth,
        effectiveHeight
      )
      .fill(WHITE);

    doc
      .lineWidth(borderWidth)
      .strokeColor(TABLE_BLUE)
      .rect(
        contentX,
        currentY,
        tableWidth,
        effectiveHeight
      )
      .stroke();

    drawCenteredText(
      doc,
      `With effective from: ${data.effectiveDate}`,
      contentX,
      currentY,
      tableWidth,
      effectiveHeight,
      {
        font: calibriPath,
        size: p(20),
        color: BLACK,
      }
    );

    currentY +=
      effectiveHeight;

    // =====================================================
    // STATEMENT
    // =====================================================

    const statementHeight =
      p(48);

    doc
      .rect(
        contentX,
        currentY,
        tableWidth,
        statementHeight
      )
      .fill(WHITE);

    doc
      .lineWidth(borderWidth)
      .strokeColor(TABLE_BLUE);

    doc
      .moveTo(
        contentX,
        currentY
      )
      .lineTo(
        contentX,
        currentY +
          statementHeight
      )
      .stroke();

    doc
      .moveTo(
        contentX +
          tableWidth,
        currentY
      )
      .lineTo(
        contentX +
          tableWidth,
        currentY +
          statementHeight
      )
      .stroke();

    drawCenteredText(
      doc,
      "100% engineered TMT that exceeds BIS standards",
      contentX,
      currentY,
      tableWidth,
      statementHeight,
      {
        font: calibriPath,
        size: p(17),
        color: STATEMENT_BLUE,
      }
    );

    currentY +=
      statementHeight;

    // =====================================================
    // FEATURES
    // =====================================================

    const featuresHeight =
      p(110);

    const featureWidth =
      tableWidth / 3;

    doc
      .rect(
        contentX,
        currentY,
        tableWidth,
        featuresHeight
      )
      .fill(WHITE);

    doc
      .lineWidth(borderWidth)
      .strokeColor(TABLE_BLUE)
      .rect(
        contentX,
        currentY,
        tableWidth,
        featuresHeight
      )
      .stroke();

    // Vertical dividers

    doc
      .moveTo(
        contentX +
          featureWidth,
        currentY
      )
      .lineTo(
        contentX +
          featureWidth,
        currentY +
          featuresHeight
      )
      .stroke();

    doc
      .moveTo(
        contentX +
          featureWidth * 2,
        currentY
      )
      .lineTo(
        contentX +
          featureWidth * 2,
        currentY +
          featuresHeight
      )
      .stroke();

    // =====================================================
    // FEATURE 1
    // =====================================================

    drawImageContain(
      doc,
      pricePath,
      contentX +
        p(15),
      currentY +
        p(8),
      featureWidth -
        p(30),
      p(38)
    );

    drawCenteredText(
      doc,
      "Prices are inclusive of all\n" +
        "the taxes & applicable on\n" +
        "advance payment.",
      contentX +
        p(8),
      currentY +
        p(48),
      featureWidth -
        p(16),
      p(55),
      {
        font: calibriPath,
        size: p(13),
        color: FEATURE_BLUE,
      }
    );

    // =====================================================
    // FEATURE 2
    // =====================================================

    drawImageContain(
      doc,
      thicknessPath,
      contentX +
        featureWidth +
        p(15),
      currentY +
        p(8),
      featureWidth -
        p(30),
      p(38)
    );

    drawCenteredText(
      doc,
      "Each piece is of 12m fixed\n" +
        "length, all dimensions are\n" +
        "subject to BIS tolerance.",
      contentX +
        featureWidth +
        p(8),
      currentY +
        p(48),
      featureWidth -
        p(16),
      p(55),
      {
        font: calibriPath,
        size: p(13),
        color: FEATURE_BLUE,
      }
    );

    // =====================================================
    // FEATURE 3
    // =====================================================

    drawImageContain(
      doc,
      homeDeliveryPath,
      contentX +
        featureWidth * 2 +
        p(15),
      currentY +
        p(8),
      featureWidth -
        p(30),
      p(38)
    );

    drawCenteredText(
      doc,
      "Free home delivery for\n" +
        "orders above 1MT within\n" +
        "5km of municipal limits.",
      contentX +
        featureWidth * 2 +
        p(8),
      currentY +
        p(48),
      featureWidth -
        p(16),
      p(55),
      {
        font: calibriPath,
        size: p(13),
        color: FEATURE_BLUE,
      }
    );

    currentY +=
      featuresHeight;

    // =====================================================
    // TMT BAR
    // =====================================================

    const rebarHeight =
      p(13);

    doc
      .rect(
        contentX,
        currentY,
        tableWidth,
        rebarHeight
      )
      .fill(BLUE);

    drawImageCover(
      doc,
      tmtBarPath,
      contentX,
      currentY,
      tableWidth,
      rebarHeight
    );

    // =====================================================
    // FOOTER
    // =====================================================

    const bottomHeight =
      p(265);

    const bottomY =
      PAGE_HEIGHT -
      bottomHeight;

    // Footer background

    drawImageCover(
      doc,
      bottomPath,
      0,
      bottomY,
      PAGE_WIDTH,
      bottomHeight
    );

    // =====================================================
    // FOOTER DETAILS
    //
    // Original:
    //
    // left: 50%
    // bottom: 30px
    // width: 680px
    // height: 140px
    // =====================================================

    const footerDetailsWidth =
      p(680);

    const footerDetailsHeight =
      p(140);

    const footerDetailsX =
      (PAGE_WIDTH -
        footerDetailsWidth) /
      2;

    const footerDetailsY =
      PAGE_HEIGHT -
      p(30) -
      footerDetailsHeight;

    drawImageContain(
      doc,
      footerDetailPath,
      footerDetailsX,
      footerDetailsY,
      footerDetailsWidth,
      footerDetailsHeight
    );

    // =====================================================
    // FINALIZE
    // =====================================================

    console.log(
      "Finalizing PDF..."
    );

    doc.end();

    const pdf =
      await pdfPromise;

    console.log(
      `PDF generated successfully. Size: ${pdf.length} bytes`
    );

    return pdf;

  } catch (error) {
    console.error(
      "PDF generation failed:",
      error
    );

    try {
      doc.end();
    } catch {
      // Ignore finalization errors
    }

    throw error;
  }
}

// =========================================================
// EXPORT
// =========================================================

export {
  generatePricePDF,
};
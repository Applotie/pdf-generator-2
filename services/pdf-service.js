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
// RUPEE SYMBOL
// =========================================================

const rupeeSymbolPath = path.join(
  __dirname,
  "../assets/Rupee-Symbol.png"
);

// =========================================================
// A4
// =========================================================

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;

const PX = 0.75;

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
    drawHeight = height;
    drawWidth = height * imageRatio;

    drawX =
      x - (drawWidth - width) / 2;

    drawY = y;
  } else {
    drawWidth = width;
    drawHeight = width / imageRatio;

    drawX = x;

    drawY =
      y - (drawHeight - height) / 2;
  }

  doc.save();

  doc
    .rect(
      x,
      y,
      width,
      height
    )
    .clip();

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
// CENTERED PRICE WITH RUPEE PNG
// =========================================================

function drawCenteredPrice(
  doc,
  amount,
  x,
  y,
  width,
  height,
  options = {}
) {
  const {
    font = dubaiBoldPath,
    size = p(22),
    color = BLACK,
  } = options;

  const priceText =
    String(amount);

  // -------------------------------------------------------
  // PRICE TEXT
  // -------------------------------------------------------

  doc
    .font(font)
    .fontSize(size)
    .fillColor(color);

  const priceWidth =
    doc.widthOfString(priceText);

  const priceHeight =
    doc.heightOfString(
      priceText,
      {
        width: priceWidth,
        lineBreak: false,
      }
    );

  // -------------------------------------------------------
  // RUPEE IMAGE SIZE
  // -------------------------------------------------------

  const rupeeImage =
    doc.openImage(rupeeSymbolPath);

  const rupeeImageWidth =
    rupeeImage.width;

  const rupeeImageHeight =
    rupeeImage.height;

  const rupeeHeight =
    size * 0.72;

  const rupeeWidth =
    rupeeHeight *
    (rupeeImageWidth / rupeeImageHeight);

  // -------------------------------------------------------
  // GAP BETWEEN RUPEE SYMBOL AND PRICE
  // -------------------------------------------------------

  const gap = p(5);

  // -------------------------------------------------------
  // TOTAL WIDTH
  // -------------------------------------------------------

  const totalWidth =
    rupeeWidth +
    gap +
    priceWidth;

  // -------------------------------------------------------
  // CENTER COMPLETE PRICE UNIT
  // -------------------------------------------------------

  const startX =
    x +
    (width - totalWidth) / 2;

  // -------------------------------------------------------
  // VERTICAL CENTERING
  // -------------------------------------------------------

  const textY =
    y +
    (height - priceHeight) / 2;

  const rupeeY =
    textY +
    (priceHeight - rupeeHeight) / 2;

  // -------------------------------------------------------
  // DRAW RUPEE PNG
  // -------------------------------------------------------

  doc.image(
    rupeeSymbolPath,
    startX,
    rupeeY,
    {
      width: rupeeWidth,
      height: rupeeHeight,
    }
  );

  // -------------------------------------------------------
  // DRAW BOLD PRICE
  // -------------------------------------------------------

  doc.text(
    priceText,
    startX +
      rupeeWidth +
      gap,
    textY,
    {
      width: priceWidth,
      lineBreak: false,
    }
  );
}

// =========================================================
// GENERATE PDF
// =========================================================

async function generatePricePDF(data) {

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

  assertFile(
    rupeeSymbolPath,
    "Rupee-Symbol.png"
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
    // JSW ONE LOGO
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
    // =====================================================

    const contentWidth =
      p(650);

    const contentX =
      (PAGE_WIDTH -
        contentWidth) / 2;

    // =====================================================
    // VERTICAL POSITION CONTROLS
    // =====================================================

    const topContentUp =
      p(20);

    const pricingContentUp =
      p(30);

    // =====================================================
    // TMT STAMP
    // =====================================================

    const stampSize =
      p(150);

    const stampX =
      contentX +
      contentWidth -
      stampSize;

    const stampY =
      p(103) -
      topContentUp;

    drawImageContain(
      doc,
      stampPath,
      stampX,
      stampY,
      stampSize,
      stampSize
    );

    // =====================================================
    // TITLE + RED LINE
    // =====================================================

    const title =
      "JSW One TMT Consumer Price";

    const titleFontSize =
      p(37);

    const titleSpacing =
      p(4);

    const redLineHeight =
      p(5);

    doc
      .font(dubaiBoldPath)
      .fontSize(titleFontSize)
      .fillColor(WHITE);

    const titleWidth =
      doc.widthOfString(title);

    const titleBounds =
      doc.boundsOfString(
        title,
        contentX,
        0,
        {
          width: titleWidth,
          lineBreak: false,
        }
      );

    // =====================================================
    // RED LINE AT STAMP CENTER
    // =====================================================

    const stampCenterY =
      stampY +
      stampSize / 2;

    const redLineY =
      stampCenterY -
      redLineHeight / 2;

    // =====================================================
    // TITLE
    // =====================================================

    const titleY =
      redLineY -
      titleSpacing -
      titleBounds.y -
      titleBounds.height;

    doc.text(
      title,
      contentX,
      titleY,
      {
        width: titleWidth,
        lineBreak: false,
      }
    );

    // =====================================================
    // RED LINE
    // =====================================================

    doc
      .rect(
        contentX,
        redLineY,
        titleWidth,
        redLineHeight
      )
      .fill(RED);

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

    // =====================================================
    // WEBSITE + TELEPHONE
    // DUBAI REGULAR
    // =====================================================

    doc
      .font(dubaiRegularPath)
      .fontSize(contactFontSize)
      .fillColor(WHITE);

    const website =
      "www.jswonetmt.com";

    const telephone =
      "1800 1030 663";

    const websiteBounds =
      doc.boundsOfString(
        website,
        firstContactX + p(30),
        0,
        {
          width: p(220),
          lineBreak: false,
        }
      );

    const telephoneBounds =
      doc.boundsOfString(
        telephone,
        0,
        0,
        {
          width: p(180),
          lineBreak: false,
        }
      );

    // =====================================================
    // TELEPHONE POSITION
    // RIGHT EDGE MATCHES RED LINE
    // =====================================================

    const telephoneGroupWidth =
      p(30) +
      telephoneBounds.width;

    const secondContactX =
      contentX +
      titleWidth -
      telephoneGroupWidth;

    // =====================================================
    // CONTACT VERTICAL POSITION
    // =====================================================

    const contactSpacing =
      titleSpacing;

    const contactTextY =
      redLineY +
      redLineHeight +
      contactSpacing;

    // =====================================================
    // WEBSITE ICON
    // =====================================================

    drawImageContain(
      doc,
      webPath,
      firstContactX,
      contactTextY + p(4),
      webIconWidth,
      contactHeight
    );

    // =====================================================
    // WEBSITE TEXT
    // =====================================================

    doc.text(
      website,
      firstContactX + p(30),
      contactTextY -
        websiteBounds.y,
      {
        width: p(220),
        lineBreak: false,
      }
    );

    // =====================================================
    // TELEPHONE ICON
    // =====================================================

    drawImageContain(
      doc,
      telephonePath,
      secondContactX,
      contactTextY,
      telephoneIconWidth,
      contactHeight
    );

    // =====================================================
    // TELEPHONE TEXT
    // =====================================================

    doc.text(
      telephone,
      secondContactX + p(30),
      contactTextY -
        telephoneBounds.y,
      {
        width: p(180),
        lineBreak: false,
      }
    );

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
      p(52);

    const rowHeight =
      p(52);

    const borderWidth =
      p(1);

    // =====================================================
    // PRICING SECTION
    // =====================================================

    const stateHeight =
      p(30);

    const pricingSectionHeight =
      stateHeight +
      p(8) +
      headerHeight +
      rowHeight *
        data.priceList.length +
      p(42) +
      p(45) +
      p(105);

    const pricingSectionTop =
      (PAGE_HEIGHT -
        pricingSectionHeight) /
        2 -
      pricingContentUp;

    let currentY =
      pricingSectionTop;

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
      stateHeight + p(8);

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

    // =====================================================
    // SECTION HEADER - BOLD
    // =====================================================

    drawCenteredText(
      doc,
      "Section",
      contentX,
      currentY,
      firstColumnWidth,
      headerHeight,
      {
        font: dubaiBoldPath,
        size: p(22),
        color: TEXT_BLUE,
      }
    );

    // =====================================================
    // PRICE HEADER - BOLD
    // =====================================================

    drawCenteredText(
      doc,
      "Recommended Price (Fe 550)",
      contentX +
        firstColumnWidth,
      currentY,
      secondColumnWidth,
      headerHeight,
      {
        font: dubaiBoldPath,
        size: p(22),
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
        Number(item.price);

      // ===================================================
      // LEFT CELL
      // ===================================================

      doc
        .rect(
          contentX,
          currentY,
          firstColumnWidth,
          rowHeight
        )
        .fill(WHITE);

      // ===================================================
      // RIGHT CELL
      // ===================================================

      doc
        .rect(
          contentX +
            firstColumnWidth,
          currentY,
          secondColumnWidth,
          rowHeight
        )
        .fill(WHITE);

      // ===================================================
      // BORDER
      // ===================================================

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

      // ===================================================
      // COLUMN DIVIDER
      // ===================================================

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

      // ===================================================
      // SECTION VALUE - BOLD
      // ===================================================

      drawCenteredText(
        doc,
        section,
        contentX,
        currentY,
        firstColumnWidth,
        rowHeight,
        {
          font: dubaiBoldPath,
          size: p(22),
          color: BLACK,
        }
      );

      // ===================================================
      // PRICE - BOLD + RUPEE PNG
      // ===================================================

      drawCenteredPrice(
        doc,
        price,
        contentX +
          firstColumnWidth,
        currentY,
        secondColumnWidth,
        rowHeight,
        {
          font: dubaiBoldPath,
          size: p(22),
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
      p(42);

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
        size: p(18),
        color: BLACK,
      }
    );

    currentY +=
      effectiveHeight;

    // =====================================================
    // STATEMENT
    // =====================================================

    const statementHeight =
      p(45);

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
        size: p(16),
        color: STATEMENT_BLUE,
      }
    );

    currentY +=
      statementHeight;

    // =====================================================
    // FEATURES
    // =====================================================

    const featuresHeight =
      p(105);

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

    // =====================================================
    // FEATURE DIVIDERS
    // =====================================================

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
        p(5),
      featureWidth -
        p(30),
      p(30)
    );

    drawCenteredText(
      doc,
      "Prices are inclusive of all\n" +
        "the taxes & applicable on\n" +
        "advance payment.",
      contentX +
        p(8),
      currentY +
        p(38),
      featureWidth -
        p(16),
      p(48),
      {
        font: calibriPath,
        size: p(12),
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
        p(5),
      featureWidth -
        p(30),
      p(30)
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
        p(38),
      featureWidth -
        p(16),
      p(48),
      {
        font: calibriPath,
        size: p(12),
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
        p(5),
      featureWidth -
        p(30),
      p(30)
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
        p(38),
      featureWidth -
        p(16),
      p(48),
      {
        font: calibriPath,
        size: p(12),
        color: FEATURE_BLUE,
      }
    );

    currentY +=
      featuresHeight;

    // =====================================================
    // TMT BAR / image.png
    // =====================================================

    const rebarHeight =
      p(10);

    const bottomHeight =
      p(265);

    const bottomY =
      PAGE_HEIGHT -
      bottomHeight;

    const footerGap =
      p(5);

    const maximumRebarY =
      bottomY -
      footerGap -
      rebarHeight;

    if (
      currentY >
      maximumRebarY
    ) {
      currentY =
        maximumRebarY;
    }

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
    // =====================================================

    const footerDetailsWidth =
      p(680);

    const footerDetailsHeight =
      p(140);

    const footerDetailsX =
      (PAGE_WIDTH -
        footerDetailsWidth) / 2;

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

    doc.end();

    const pdf =
      await pdfPromise;

    return pdf;

  } catch (error) {

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
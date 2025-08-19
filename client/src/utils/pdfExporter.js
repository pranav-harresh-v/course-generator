import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Downloads a lesson as PDF
 * @param {Object} lesson - Lesson object with `content` blocks
 * @param {string} title - Lesson title (used as filename + heading)
 */
export async function downloadLessonAsPDF(lesson, title = "lesson") {
  if (!lesson) return;

  // Create a temporary container for rendering
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.top = "-9999px";
  container.style.left = "-9999px";
  container.style.width = "800px";
  container.style.background = "white";
  container.style.color = "black";
  container.style.padding = "20px";
  container.style.fontFamily = "sans-serif";
  container.style.fontSize = "14px";
  container.style.lineHeight = "1.6";

  // Add title
  const heading = document.createElement("h1");
  heading.innerText = title;
  heading.style.fontSize = "20px";
  heading.style.marginBottom = "16px";
  container.appendChild(heading);

  // Render lesson blocks
  lesson.content?.forEach((block) => {
    switch (block.type) {
      case "heading": {
        const el = document.createElement("h2");
        el.innerText = block.text;
        el.style.fontSize = "16px";
        el.style.marginTop = "12px";
        container.appendChild(el);
        break;
      }
      case "paragraph": {
        const p = document.createElement("p");
        p.innerText = block.text;
        container.appendChild(p);
        break;
      }
      case "code": {
        const pre = document.createElement("pre");
        pre.innerText = block.text;
        pre.style.background = "#f4f4f4";
        pre.style.padding = "8px";
        pre.style.borderRadius = "6px";
        pre.style.fontFamily = "monospace";
        pre.style.fontSize = "12px";
        pre.style.overflowX = "auto";
        container.appendChild(pre);
        break;
      }
      case "mcq": {
        const q = document.createElement("p");
        q.innerHTML = `<strong>Q: ${block.question}</strong>`;
        container.appendChild(q);

        const ul = document.createElement("ul");
        ul.style.marginLeft = "16px";
        block.options.forEach((opt) => {
          const li = document.createElement("li");
          li.innerText = opt;
          if (opt === block.answer) {
            li.style.color = "green";
            li.style.fontWeight = "bold";
          }
          ul.appendChild(li);
        });
        container.appendChild(ul);

        const expl = document.createElement("p");
        expl.innerText = `Explanation: ${block.explanation}`;
        expl.style.fontSize = "12px";
        expl.style.color = "gray";
        container.appendChild(expl);
        break;
      }
      case "video": {
        const v = document.createElement("p");
        v.innerText = `🎥 Video placeholder: ${block.query}`;
        v.style.fontStyle = "italic";
        v.style.color = "gray";
        container.appendChild(v);
        break;
      }
      default:
        break;
    }
  });

  document.body.appendChild(container);

  // Convert to PDF
  const canvas = await html2canvas(container, {
    scale: 2,
    backgroundColor: "#ffffff",
  });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pageWidth;
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  let position = 0;
  pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);

  if (pdfHeight > pageHeight) {
    let heightLeft = pdfHeight - pageHeight;
    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }
  }

  pdf.save(`${title}.pdf`);

  // Cleanup
  document.body.removeChild(container);
}

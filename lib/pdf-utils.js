import { jsPDF } from "jspdf";

/**
 * Generates a formal Karnataka Government Permit Letter
 * @param {Object} data - The form data (name, district, reason, date, etc.)
 */
export const generatePermitPDF = (data) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("GOVERNMENT OF KARNATAKA", 105, 20, { align: "center" });
  
  doc.setFontSize(14);
  doc.text("Urban Development Department", 105, 30, { align: "center" });
  
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);
  
  // Reference & Date
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const refNo = `REF: KA-UDT-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`;
  doc.text(refNo, 20, 45);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 190, 45, { align: "right" });
  
  // Subject
  doc.setFont("helvetica", "bold");
  doc.text("Subject: Provisional Permit for Civic Operations", 20, 60);
  
  // Body
  doc.setFont("helvetica", "normal");
  const body = `This is to certify that permission is hereby granted to ${data.name || "the applicant"} for the purpose of '${data.title || data.category}' in the district of ${data.district || "Karnataka"}.
  
Details of the permit:
- Location/Area: ${data.location || "Authorized Zones"}
- Purpose: ${data.reason || data.title}
- Effective Date: ${data.date || new Date().toLocaleDateString()}
- Valid Until: ${data.expiryDate || "Completion of task"}

This permit is issued digitally through the Urban Digital Twin Dashboard. The applicant must adhere to all local municipal guidelines and safety protocols. Any violation will lead to immediate cancellation of this permit.`;

  const splitText = doc.splitTextToSize(body, 170);
  doc.text(splitText, 20, 75);
  
  // Footer / Signature
  doc.setFont("helvetica", "italic");
  doc.text("Digitally Signed by:", 140, 160);
  doc.setFont("helvetica", "bold");
  doc.text("Nodal Officer (Digital Twin)", 140, 165);
  doc.text("Government of Karnataka", 140, 170);
  
  // Stamp Overlay (Mock)
  doc.setDrawColor(200, 0, 0);
  doc.rect(140, 175, 40, 20);
  doc.setTextColor(200, 0, 0);
  doc.setFontSize(8);
  doc.text("OFFICIAL SEAL", 160, 185, { align: "center" });
  doc.text("VERIFIED", 160, 190, { align: "center" });

  doc.save(`Permit_${refNo}.pdf`);
};

import React, { useRef, useState, useEffect } from "react";

const PriceList = () => {
  const componentRef = useRef();
  const [currentDate, setCurrentDate] = useState("");

  // Initialize with empty prices for manual entry
  const [leftColumn, setLeftColumn] = useState([
    { id: 24, name: "پھول گوبھی", first: "", second: "" },
    { id: 25, name: "بند گوبھی", first: "", second: "" },
    { id: 26, name: "مٹر (پنجاب)", first: "", second: "" },
    { id: 27, name: "مٹر (لوکل)", first: "", second: "" },
    { id: 32, name: "ٹینڈا (فارم)", first: "", second: "" },
    { id: 33, name: "ٹینڈا (دیسی)", first: "", second: "" },
    { id: 35, name: "شلجم (لوکل)", first: "", second: "" },
    { id: 36, name: "گاجر", first: "", second: "" },
    { id: 39, name: "فرانس بین", first: "", second: "" },
  ]);

  const [rightColumn, setRightColumn] = useState([
    { id: 2, name: "آلو سفید نیا", first: "", second: "" },
    { id: 3, name: "آلو سرخ نیا", first: "", second: "" },
    { id: 5, name: "پیاز", first: "", second: "" },
    { id: 9, name: "ٹماٹر (ملکی)", first: "", second: "" },
    { id: 10, name: "کچالو (سوات)", first: "", second: "" },
    { id: 11, name: "کچالو (ادھوری)", first: "", second: "" },
    { id: 12, name: "سبز مرچ", first: "", second: "" },
    { id: 13, name: "شملہ مرچ", first: "", second: "" },
    { id: 15, name: "لیموں (چائنہ)", first: "", second: "" },
    { id: 16, name: "بینگن (گول)", first: "", second: "" },
    { id: 17, name: "بینگن (لمبا)", first: "", second: "" },
    { id: 18, name: "کھیرا", first: "", second: "" },
    { id: 19, name: "لہسن (پاک)", first: "", second: "" },
    { id: 20, name: "لہسن (چائنہ)", first: "", second: "" },
    { id: 22, name: "ادرک (تھائی لینڈ)", first: "", second: "" },
    { id: 23, name: "کدو", first: "", second: "" },
  ]);

  // Get current date automatically on component mount
  useEffect(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    setCurrentDate(`${day}/${month}`);
  }, []);

  const handlePrint = () => {
    const printContents = componentRef.current.innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html dir="rtl">
        <head>
          <title>Price List ${currentDate}</title>
          <style>
            @page { size: A4; margin: 10mm; }
            body { margin: 0; padding: 0; font-family: serif; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid black; padding: 4px; }
            input { border: none; background: transparent; text-align: center; font-weight: bold; width: 100%; }
            .no-print { display: none !important; }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  // Update price handlers
  const updatePrice = (column, index, field, value) => {
    if (column === "left") {
      setLeftColumn((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: value };
        return updated;
      });
    } else {
      setRightColumn((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: value };
        return updated;
      });
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="flex gap-4 mb-4">
        <button
          onClick={handlePrint}
          className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition font-bold"
        >
          Print / Save as PDF
        </button>
        <button
          onClick={() => {
            setLeftColumn((prev) =>
              prev.map((item) => ({ ...item, first: "", second: "" })),
            );
            setRightColumn((prev) =>
              prev.map((item) => ({ ...item, first: "", second: "" })),
            );
          }}
          className="px-6 py-2 bg-gray-600 text-white rounded shadow hover:bg-gray-700 transition font-bold"
        >
          Clear All
        </button>
      </div>

      {/* Printable Area */}
      <div
        ref={componentRef}
        className="w-[210mm] min-h-[297mm] bg-white p-4 border-[3px] border-emerald-800 shadow-lg relative font-serif"
        dir="rtl"
      >
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4 border-b-2 border-emerald-800 pb-2">
          <div className="text-left text-lg font-bold">
            مورخہ: {currentDate}
          </div>
          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold text-emerald-900">
              نرخنامہ برائے فریش سبزی محکمہ خوراک ضلع چارسدہ
            </h1>
            <div className="flex justify-center gap-8 mt-2 text-sm font-semibold">
              <span>ڈپٹی کمشنر: 9220024-091</span>
              <span>ڈی ایف او: 9220116-091</span>
            </div>
          </div>
          <div className="w-24 h-24 border border-dashed border-gray-400 flex items-center justify-center text-xs">
            [Logo Image]
          </div>
        </div>

        {/* Tables Container */}
        <div className="flex gap-0 border-t border-black">
          {/* Left Table Section */}
          <EditableTable
            data={leftColumn}
            onUpdate={(index, field, value) =>
              updatePrice("left", index, field, value)
            }
          />
          {/* Right Table Section */}
          <EditableTable
            data={rightColumn}
            onUpdate={(index, field, value) =>
              updatePrice("right", index, field, value)
            }
          />
        </div>

        {/* Footer Section */}
        <div className="mt-8 grid grid-cols-3 text-center text-xs font-bold gap-4">
          <div className="border-t border-black pt-2">
            District Administration <br /> Charsadda
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border rounded-full border-blue-500 flex items-center justify-center text-[8px] text-blue-500 mb-1">
              Official Seal
            </div>
            <span>District Food Controller Charsadda</span>
          </div>
          <div className="border-t border-black pt-2">TMA سبزی منڈی چارسدہ</div>
        </div>

        {/* Contact Info */}
        <div className="mt-4 text-[10px] text-right leading-tight">
          <p>کسی بھی شکایت کی صورت میں مندرجہ ذیل نمبروں پر رابطہ کریں:</p>
          <p>
            AC Tangi: 091-6555206 | AC Shabqadar: 091-6289477 | AC Charsadda:
            091-9220137
          </p>
        </div>
      </div>
    </div>
  );
};

// Editable Table Component with input fields
const EditableTable = ({ data, onUpdate }) => (
  <table className="w-1/2 border-collapse border border-black text-sm">
    <thead>
      <tr className="bg-emerald-50">
        <th className="border border-black p-1 w-12">نمبر شمار</th>
        <th className="border border-black p-1">نام سبزی</th>
        <th className="border border-black p-1 w-20 text-[10px]">
          درجہ اول فی کلو
        </th>
        <th className="border border-black p-1 w-20 text-[10px]">
          درجہ دوم فی کلو
        </th>
      </tr>
    </thead>
    <tbody>
      {[...Array(23)].map((_, i) => {
        const item = data[i] || {};
        return (
          <tr key={i} className="h-7">
            <td className="border border-black text-center">{item.id || ""}</td>
            <td className="border border-black px-2 text-right font-semibold">
              {item.name || ""}
            </td>
            <td className="border border-black text-center p-0">
              <input
                type="text"
                value={item.first || ""}
                onChange={(e) => onUpdate(i, "first", e.target.value)}
                className="w-full h-full text-center font-bold text-blue-800 bg-transparent border-none focus:outline-none focus:bg-yellow-100"
                placeholder=""
              />
            </td>
            <td className="border border-black text-center p-0">
              <input
                type="text"
                value={item.second || ""}
                onChange={(e) => onUpdate(i, "second", e.target.value)}
                className="w-full h-full text-center font-bold text-blue-800 bg-transparent border-none focus:outline-none focus:bg-yellow-100"
                placeholder=""
              />
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

export default PriceList;

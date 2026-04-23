import React, { useRef, useState, useEffect } from "react";

const PriceList = () => {
  const componentRef = useRef();
  const [currentDate, setCurrentDate] = useState("");

  const [leftColumn, setLeftColumn] = useState([
    { id: 1, name: "پھول گوبھی", first: "", second: "" },
    { id: 2, name: "بند گوبھی", first: "", second: "" },
    { id: 3, name: "مٹر (پنجاب)", first: "", second: "" },
    { id: 4, name: "مٹر (لوکل)", first: "", second: "" },
    { id: 5, name: "ٹینڈا (فارم)", first: "", second: "" },
    { id: 6, name: "ٹینڈا (دیسی)", first: "", second: "" },
    { id: 7, name: "شلجم (لوکل)", first: "", second: "" },
    { id: 8, name: "گاجر", first: "", second: "" },
    { id: 9, name: "فرانس بین", first: "", second: "" },
    { id: 10, name: "آلو سفید نیا", first: "", second: "" },
    { id: 11, name: "آلو سرخ نیا", first: "", second: "" },
    { id: 12, name: "پیاز", first: "", second: "" },
    { id: 13, name: "ٹماٹر (ملکی)", first: "", second: "" },
    { id: 14, name: "کچالو (سوات)", first: "", second: "" },
    { id: 15, name: "کچالو (ادھوری)", first: "", second: "" },
    { id: 16, name: "سبز مرچ", first: "", second: "" },
    { id: 17, name: "شملہ مرچ", first: "", second: "" },
    { id: 18, name: "لیموں (چائنہ)", first: "", second: "" },
    { id: 19, name: "بینگن (گول)", first: "", second: "" },
    { id: 20, name: "بینگن (لمبا)", first: "", second: "" },
  ]);

  const [rightColumn, setRightColumn] = useState([
    { id: 21, name: "کھیرا", first: "", second: "" },
    { id: 22, name: "لہسن (پاک)", first: "", second: "" },
    { id: 23, name: "لہسن (چائنہ)", first: "", second: "" },
    { id: 24, name: "ادرک (تھائی لینڈ)", first: "", second: "" },
    { id: 25, name: "ادرک (پاکستان)", first: "", second: "" },
    { id: 26, name: "ہری مرچ", first: "", second: "" },
    { id: 27, name: "ہری مرچ (چائنہ)", first: "", second: "" },
    { id: 28, name: "ہری مرچ (تھائی لینڈ)", first: "", second: "" },
    { id: 29, name: "ہری مرچ (دیسی)", first: "", second: "" },
    { id: 30, name: "ہری مرچ (بنگلہ دیش)", first: "", second: "" },
    { id: 31, name: "ہری مرچ (بھارت)", first: "", second: "" },
    { id: 32, name: "ہری مرچ (ایران)", first: "", second: "" },
    { id: 33, name: "ہری مرچ (ترکی)", first: "", second: "" },
    { id: 34, name: "ہری مرچ (سعودی عرب)", first: "", second: "" },
    { id: 35, name: "ہری مرچ (متفرق)", first: "", second: "" },
    { id: 36, name: "ہری مرچ (دیگر)", first: "", second: "" },
    { id: 37, name: "ہری مرچ (بنگلہ دیش)", first: "", second: "" },
    { id: 38, name: "ہری مرچ (ترکی)", first: "", second: "" },
    { id: 39, name: "ہری مرچ (بنگلہ دیش)", first: "", second: "" },
    { id: 40, name: "ہری مرچ (بنگلہ دیش)", first: "", second: "" },
  ]);

  useEffect(() => {
    const today = new Date();
    setCurrentDate(`${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`);
  }, []);

  const handlePrint = () => {
    const content = componentRef.current;
    const printWindow = window.open("", "_blank");
    const styles = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules).map((rule) => rule.cssText).join("");
        } catch (e) { return ""; }
      })
      .join("");

    printWindow.document.write(`
      <html dir="rtl">
        <head>
          <title>Price List - Charsadda</title>
          <style>
            ${styles} 
            @media print {
              @page { size: A4; margin: 4mm; }
              body { -webkit-print-color-adjust: exact; margin: 0; }
              .no-print { display: none !important; }
            }
            body { font-family: 'Noto Nastaliq Urdu', serif; padding: 10px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1.2px solid black !important; line-height: 1; }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${content.innerHTML}
          </div>
          <script>
            const inputs = document.querySelectorAll('input');
            inputs.forEach(input => {
              const span = document.createElement('span');
              span.textContent = input.value;
              span.style.fontWeight = 'bold';
              span.style.color = '#1e40af';
              input.parentNode.replaceChild(span, input);
            });
            window.onload = () => {
              setTimeout(() => { window.print(); window.close(); }, 250);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const updatePrice = (column, index, field, value) => {
    const setter = column === "left" ? setLeftColumn : setRightColumn;
    setter((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  return (
    <div className="p-4 bg-gray-200 min-h-screen flex flex-col items-center no-print">
      <div className="flex gap-4 mb-4 no-print">
        <button onClick={handlePrint} className="px-6 py-2 bg-emerald-700 text-white rounded shadow hover:bg-emerald-800 font-bold">
          Print / Save PDF
        </button>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700 font-bold">
          Reset
        </button>
      </div>

      <div
        ref={componentRef}
        className="w-[210mm] bg-white p-4 border-[3px] border-emerald-900 shadow-2xl relative"
        dir="rtl"
      >
        {/* Header - Thoda compact kiya */}
        <div className="flex justify-between items-center mb-2 border-b-2 border-emerald-900 pb-2">
          <div className="text-lg font-bold text-black">مورخہ: {currentDate}</div>
          <div className="text-center flex-1">
            <h1 className="text-2xl font-black text-emerald-900 mb-0">
              نرخنامہ برائے فریش سبزی محکمہ خوراک ضلع چارسدہ
            </h1>
            <div className="flex justify-center gap-8 text-xs font-bold text-gray-800">
              <span>ڈپٹی کمشنر: 9220024-091</span>
              <span>ڈی ایف او: 9220116-091</span>
            </div>
          </div>
          <div className="w-16 h-16 border border-emerald-900 flex items-center justify-center font-bold text-[10px] text-center">
            GOVT LOGO
          </div>
        </div>

        {/* Tables */}
        <div className="flex">
          <EditableTable data={leftColumn} onUpdate={(i, f, v) => updatePrice("left", i, f, v)} />
          <EditableTable data={rightColumn} onUpdate={(i, f, v) => updatePrice("right", i, f, v)} />
        </div>

        {/* Footer - Space kam ki */}
        <div className="mt-4 grid grid-cols-3 text-center items-end text-[10px]">
          <div className="font-bold">
            <div className="border-t border-black pt-1 mx-2">District Administration Charsadda</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border border-blue-800 rounded-full flex items-center justify-center text-[7px] text-blue-800 font-bold mb-1">
              Official Seal
            </div>
            <span className="font-bold">District Food Controller Charsadda</span>
          </div>
          <div className="font-bold">
            <div className="border-t border-black pt-1 mx-2 text-sm">TMA سبزی منڈی چارسدہ</div>
          </div>
        </div>

        <div className="mt-2 text-[9px] font-bold text-right border-t border-gray-300 pt-1">
          <p>کسی بھی شکایت کی صورت میں ان نمبروں پر رابطہ کریں: AC Tangi: 091-6555206 | AC Shabqadar: 091-6289477 | AC Charsadda: 091-9220137</p>
        </div>
      </div>
    </div>
  );
};

const EditableTable = ({ data, onUpdate }) => (
  <table className="w-1/2 table-fixed border-collapse">
    <thead>
      <tr className="bg-emerald-100 h-10">
        <th className="border-2 border-black w-[12%] text-xs">نمبر</th>
        <th className="border-2 border-black w-[48%] text-base">نام سبزی</th>
        <th className="border-2 border-black w-[20%] text-[10px] leading-tight">درجہ اول</th>
        <th className="border-2 border-black w-[20%] text-[10px] leading-tight">درجہ دوم</th>
      </tr>
    </thead>
    <tbody>
      {data.map((item, i) => (
        <tr key={i} className="h-[28px]"> {/* Fixed compact height */}
          <td className="border-2 border-black text-center font-bold text-xs">{item.id}</td>
          <td className="border-2 border-black px-1 text-right font-bold text-sm overflow-hidden whitespace-nowrap">
            {item.name}
          </td>
          <td className="border-2 border-black p-0">
            <input
              type="text"
              value={item.first}
              onChange={(e) => onUpdate(i, "first", e.target.value)}
              className="w-full h-full text-center font-bold text-blue-800 bg-transparent outline-none text-sm"
            />
          </td>
          <td className="border-2 border-black p-0">
            <input
              type="text"
              value={item.second}
              onChange={(e) => onUpdate(i, "second", e.target.value)}
              className="w-full h-full text-center font-bold text-blue-800 bg-transparent outline-none text-sm"
            />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default PriceList;
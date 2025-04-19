// Templates with placeholder format
export const templates = [
  {
    id: 'invoice',
    name: 'Tax Invoice',
    description: 'Standard tax invoice template',
    fields: [
      { id: 'billTo', label: 'Billed To', type: 'text', required: true, placeholder: '{{billTo}}' },
      { id: 'place', label: 'Place of Supply', type: 'text', required: true, placeholder: '{{place}}' },
      { id: 'invoiceNo', label: 'Invoice No', type: 'text', required: true, placeholder: '{{invoiceNo}}' },
      { id: 'invoiceDate', label: 'Date', type: 'date', required: true, placeholder: '{{invoiceDate}}' },
      { id: 'goodsName', label: 'Description of Goods', type: 'text', required: true, placeholder: '{{goodsName}}' },
      { id: 'hsnCode', label: 'HSN Code', type: 'text', required: true, placeholder: '{{hsnCode}}' },
      { id: 'qty', label: 'Quantity', type: 'number', required: true, placeholder: '{{qty}}' },
      { id: 'units', label: 'Units', type: 'text', required: true, placeholder: '{{units}}' },
      { id: 'rate', label: 'Rate', type: 'number', required: true, placeholder: '{{rate}}' },
      { id: 'amount', label: 'Amount', type: 'number', required: true, placeholder: '{{amount}}' },
      { id: 'total', label: 'Total', type: 'number', required: true, placeholder: '{{total}}' },
      { id: 'taxableValue', label: 'Taxable Value', type: 'number', required: true, placeholder: '{{taxableValue}}' },
      { id: 'cgst', label: 'CGST Amount', type: 'number', required: true, placeholder: '{{cgst}}' },
      { id: 'sgst', label: 'SGST Amount', type: 'number', required: true, placeholder: '{{sgst}}' },
      { id: 'grandTotal', label: 'Grand Total', type: 'number', required: true, placeholder: '{{grandTotal}}' },
      { id: 'amountWords', label: 'Amount in Words', type: 'text', required: true, placeholder: '{{amountWords}}' },
    ],
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invoice</title>
  <style>
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      padding: 40px;
      /* Remove color and background for printing */
      color: #000;
      background: #fff;
    }
    .invoice-box {
      max-width: 800px;
      margin: auto;
      border: 1px solid #000;
      border-radius: 0;
      background: #fff;
      padding: 32px 32px 24px 32px;
      font-size: 15px;
      line-height: 24px;
      box-shadow: none;
    }
    .invoice-title {
      text-align: center;
      font-size: 22px;
      font-weight: 700;
      /* Remove color */
      color: #000;
      margin-bottom: 20px;
      letter-spacing: 2px;
      text-decoration: underline;
    }
    h2 {
      margin: 0 0 6px 0;
      color: #000;
      font-size: 26px;
      font-weight: 600;
    }
    p {
      margin: 0 0 16px 0;
      color: #000;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 18px;
    }
    table, th, td {
      border: 1px solid #000;
    }
    th, td {
      padding: 10px 8px;
    }
    th {
      background: #fff;
      color: #000;
      font-weight: 600;
      font-size: 15px;
      letter-spacing: 1px;
      border-bottom: 2px solid #000;
    }
    td {
      background: #fff;
      color: #000;
    }
    .text-right {
      text-align: right;
    }
    h3 {
      margin: 24px 0 8px 0;
      font-size: 17px;
      color: #000;
      font-weight: 600;
      letter-spacing: 1px;
    }
    strong {
      color: #000;
    }
    #grandTotal strong {
      color: #000;
      font-size: 18px;
      letter-spacing: 1px;
    }
    /* Responsive */
    @media (max-width: 600px) {
      .invoice-box {
        padding: 12px 4px;
      }
      table, th, td {
        font-size: 13px;
      }
      h2, .invoice-title {
        font-size: 18px;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-box">
    <div class="invoice-title">TAX INVOICE</div>
    <div style="text-align:center">
      <h2>Swastik Enterprises</h2>
      <p>
        Chhota Bazar, Ghas Mandi, Gwalior, M.P.<br>
        GSTIN: 23ACWPELB9571ZZS
      </p>
    </div>

    <table>
      <tr>
        <td>
          <strong>Billed To:</strong><br>
          <span>{{billTo}}</span>
        </td>
        <td>
          <strong>Place of Supply:</strong><br>
          <span>{{place}}</span>
        </td>
      </tr>
      <tr>
        <td>
          <strong>Invoice No:</strong><br>
          <span>{{invoiceNo}}</span>
        </td>
        <td>
          <strong>Date:</strong><br>
          <span>{{invoiceDate}}</span>
        </td>
      </tr>
    </table>

    <table>
      <thead>
        <tr>
          <th>Description of Goods</th>
          <th>HSN Code</th>
          <th>QTY</th>
          <th>Units</th>
          <th>Rate</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{goodsName}}</td>
          <td>{{hsnCode}}</td>
          <td>{{qty}}</td>
          <td>{{units}}</td>
          <td>{{rate}}</td>
          <td>{{amount}}</td>
        </tr>
      </tbody>
    </table>

    <table>
      <tr>
        <td colspan="5">Total</td>
        <td class="text-right">{{total}}</td>
      </tr>
      <tr>
        <td colspan="5">Taxable Value</td>
        <td class="text-right">{{taxableValue}}</td>
      </tr>
      <tr>
        <td colspan="5">ADD CGST (14%)</td>
        <td class="text-right">{{cgst}}</td>
      </tr>
      <tr>
        <td colspan="5">ADD SGST (14%)</td>
        <td class="text-right">{{sgst}}</td>
      </tr>
      <tr>
        <td colspan="5"><strong>Grand Total</strong></td>
        <td class="text-right"><strong>{{grandTotal}}</strong></td>
      </tr>
    </table>

    <p>
      <strong>FOR NEFT:</strong><br>
      KOTAK MAHINDRA BANK<br>
      IFSC: KKBK0005949<br>
      A/C NO.: 2413226060
    </p>

    <p>
      <strong>Amount in Words:</strong>
      <span>{{amountWords}}</span>
    </p>

    <p style="margin-top: 40px; text-align: right;">
      For Swastik Enterprises<br>
      <i>Authorised Signatory</i>
    </p>
  </div>
</body>
</html>`
  },
  {
    id: 'receipt',
    name: 'Payment Receipt',
    description: 'Simple payment receipt template',
    fields: [
      { id: 'receivedFrom', label: 'Received From', type: 'text', required: true, placeholder: '{{receivedFrom}}' },
      { id: 'receiptNo', label: 'Receipt No', type: 'text', required: true, placeholder: '{{receiptNo}}' },
      { id: 'receiptDate', label: 'Date', type: 'date', required: true, placeholder: '{{receiptDate}}' },
      { id: 'amount', label: 'Amount', type: 'number', required: true, placeholder: '{{amount}}' },
      { id: 'amountWords', label: 'Amount in Words', type: 'text', required: true, placeholder: '{{amountWords}}' },
      { id: 'paymentMode', label: 'Payment Mode', type: 'text', required: true, placeholder: '{{paymentMode}}' },
    ],
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Payment Receipt</title>
  <style>
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      padding: 40px;
      color: #000;
      background: #fff;
    }
    .receipt-box {
      max-width: 700px;
      margin: auto;
      border: 1px solid #000;
      border-radius: 0;
      padding: 32px;
      font-size: 15px;
      line-height: 24px;
    }
    .receipt-title {
      text-align: center;
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 20px;
      letter-spacing: 1px;
      text-decoration: underline;
    }
    h2 {
      margin: 0 0 6px 0;
      color: #000;
      font-size: 26px;
      font-weight: 600;
    }
    .receipt-info {
      margin-bottom: 20px;
      border: 1px solid #000;
      padding: 15px;
    }
    .receipt-info p {
      margin: 6px 0;
    }
    .amount-box {
      border: 1px solid #000;
      padding: 15px;
      margin: 15px 0;
      text-align: center;
      font-size: 18px;
      font-weight: 600;
    }
    .signature {
      margin-top: 40px;
      text-align: right;
    }
    /* Responsive */
    @media (max-width: 600px) {
      .receipt-box {
        padding: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="receipt-box">
    <div class="receipt-title">PAYMENT RECEIPT</div>
    <div style="text-align:center">
      <h2>Swastik Enterprises</h2>
      <p>
        Chhota Bazar, Ghas Mandi, Gwalior, M.P.<br>
        GSTIN: 23ACWPELB9571ZZS
      </p>
    </div>

    <div class="receipt-info">
      <p><strong>Receipt No:</strong> {{receiptNo}}</p>
      <p><strong>Date:</strong> {{receiptDate}}</p>
      <p><strong>Received From:</strong> {{receivedFrom}}</p>
      <p><strong>Payment Mode:</strong> {{paymentMode}}</p>
    </div>

    <div class="amount-box">
      <p>Amount: ₹{{amount}}</p>
    </div>

    <p>
      <strong>Amount in Words:</strong>
      {{amountWords}}
    </p>

    <div class="signature">
      For Swastik Enterprises<br>
      <i>Authorised Signatory</i>
    </div>
  </div>
</body>
</html>`
  }
];

// For backward compatibility
export const html = templates[0].html;
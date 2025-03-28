import AsyncStorage from "@react-native-async-storage/async-storage";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import RNFS from "react-native-fs";
import { Image } from "react-native";
import { requestStoragePermission } from "../Screens/billScreen/SaleInvoice";

export const PurchesePdfGenerate = async (
  billNumber, date, selectedCustomer, selectedProducts,
  totalBasePrice, totalGSTAmount, totalAmount, paymentMethod,
  halfGSTPercentage, halfGstAmount, totalprice, customerData
) => {

  const safeProducts = Array.isArray(selectedProducts) ? selectedProducts : [];
  const safeTotalBasePrice = typeof totalBasePrice === "number" ? totalBasePrice : 0;
  const safeTotalGSTAmount = typeof totalGSTAmount === "number" ? totalGSTAmount : 0;
  const safeTotalPrice = typeof totalprice === "number" ? totalprice : 0;

  const paidImageUrl = "https://res.cloudinary.com/dpbx63xbs/image/upload/v1743071474/b1gxpxky2f6our77uwj6.png";
  const unpaidImageUrl = "https://res.cloudinary.com/dpbx63xbs/image/upload/v1743071474/xraxi7glabfbmqjj9xus.png";
  
  const selectedImageBase64 = paymentMethod === "Cash" || paymentMethod === "Online"
    ? paidImageUrl
    : unpaidImageUrl
  try {

    const htmlContent = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              margin: 0;
              color: #333;
              background-color: #fff;
            }
            .invoice-box {
              max-width: 800px;
              margin: auto;
              border: 2px solid #d32f2f;
              padding: 20px;
              border-radius: 10px;
            }
            .header {
             text-align: right;
              font-size: 16px;
              font-weight: bold;
              color:black;
            }
            .invoice-header {
              font-size: 16px;
            }
            .address-header{
               text-align: right;
              font-size: 12px;
              font-weight: bold;
              color:black;
              }
            .customer-info {
              display: flex;
              justify-content: space-between;
              align-items: center;
              background:#FFEDEE;
              padding: 10px;
              margin-top: 10px;
              border-radius: 5px;
              font-size: 14px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: center;
            }
            th {
              background-color: #E5E5E5;
              font-weight: bold;
            }
            .summary {
              font-size: 16px;
              font-weight: bold;
              text-align: right;
              margin-top: 10px;
            }
            .total-amount {
              font-size: 22px;
              font-weight: bold;
              text-align: right;
              color: #000;
              margin-top: 15px;
            }
            .status {
              font-size: 20px;
              font-weight: bold;
              color: blue;
              text-align: right;
              margin-top: 5px;
            }
            .total-amount{
              font-size: 24px;
              padding:4px;
              width:fit-content;
              font-weight: bold;
              color: black;
              text-align: right;
              margin-top: 10px;
              background-color:#E5E5E5;
            }
            .total-Price{
            display:flex;
            justify-content:end;
            }
            box{
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div>
                <div class="header">${customerData?.username || "Your Khana Name"}</div>
                ${customerData.businessAddressId ? `
                  <div class="address-header">${customerData.businessAddressId?.flatOrBuildingNo}</div>
                  <div class="address-header">${customerData.businessAddressId?.areaOrLocality}</div>
                  <div class="address-header">${customerData.businessAddressId?.pincode}</div>
                ` : ''}
                ${customerData.GSTIN ? `<div class="address-header">GST IN: ${customerData?.GSTIN}</div>` : ''}
              </div>
            <div class="invoice-header">
            <div>
              <strong>Invoice No: ${billNumber}</strong><br />
                <strong>Invoice Date: ${new Date(date).toLocaleDateString('en-GB')}</strong>
            </div>
            </div>
            <div class="customer-info">
            <div>
                <strong>Bill To</strong><br />
                Name: ${selectedCustomer.name}<br />
                Phone: ${selectedCustomer.phone}<br />
                ${selectedCustomer.billingAddressId ? `
                  Address: ${selectedCustomer.billingAddressId?.flatOrBuildingNo}<br />
                  ${selectedCustomer.billingAddressId?.areaOrLocality}, ${selectedCustomer.billingAddressId?.city}<br />
                  ${selectedCustomer.billingAddressId?.state} - ${selectedCustomer.billingAddressId?.pincode}
                ` : ''}
                ${selectedCustomer.GSTIN ? `<br />GST IN: ${selectedCustomer?.GSTIN}` : ''}
              </div>
            <div>
              <img src="${selectedImageBase64}" width="100" height="100" />
            </div>
            </div>
            <table>
          <tr>
            <th>S.No</th>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>GST%</th>
            <th>Total</th>
          </tr>
  ${safeProducts
        .map((item, index) => {
          const basePrice = (item.costPrice * 100) / (100 + item.gstPercentage);
          return `
        <tr>
          <td>${index + 1}</td>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>${basePrice.toFixed(2)}</td>
         <td>${((item.costPrice - basePrice) * item.quantity).toFixed(2)}%</td>
          <td>${(item.costPrice * item.quantity).toFixed(2)}</td>
        </tr>
      `;
        })
        .join("")}
  
  <!-- Subtotal Row -->
  <tr style="background-color: #E5E5E5; font-weight: bold;">
    <td colspan="2" style="text-align: center;">Subtotal</td>
    <td>${safeProducts.reduce((sum, item) => sum + item.quantity, 0)}</td>
    <td>${safeTotalBasePrice.toFixed(2)}</td>
    <td>${safeTotalGSTAmount.toFixed(2)}</td>
    <td>${safeTotalPrice.toFixed(2)}</td>
  </tr>
</table>


            <table>
              <tr>
                <th>Tax Slab</th>
                <th>Taxable Amount</th>
                <th>Tax</th>
              </tr>
              <tr>
                <td>CGST ${halfGSTPercentage.toFixed(0)}%</td>
                <td>${safeTotalBasePrice.toFixed(2)}</td>
                <td>${halfGstAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td>SGST ${halfGSTPercentage.toFixed(0)}%</td>
                <td>${safeTotalBasePrice.toFixed(2)}</td>
                <td>${halfGstAmount.toFixed(2)}</td>
              </tr>
            </table>
            <div class="total-Price">
            <p class="total-amount">Total Amount -  ${safeTotalPrice.toFixed(2)}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const options = {
      html: htmlContent,
      fileName: `invoice_${billNumber}`,
      directory: "Download",
    };

    const pdf = await RNHTMLtoPDF.convert(options);
    // console.log("PDF generated at:", pdf.filePath);

    const filePath = `${RNFS.DocumentDirectoryPath}/invoice_${billNumber}.pdf`;
    await RNFS.moveFile(pdf.filePath, filePath);
    // console.log("PDF saved to:", filePath);

    return filePath;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return null;
  }
};

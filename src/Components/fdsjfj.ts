  const saveInvoice = async () => {

    try {
      const filePath = await generatePDF(userName, billNumber, date, selectedCustomer, selectedProducts, totalBasePrice, totalGSTAmount, totalAmount, paymentMethod);
      if (filePath) {
        Alert.alert("Invoice Saved", `Saved at: ${filePath}`);
      } else {
        Alert.alert("Failed to save invoice.");
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
    }

  };

  // Share PDF via WhatsApp or other apps
  const shareInvoice = async () => {
    try {
      const filePath = await generatePDF(
        billNumber,
        date,
        selectedCustomer,
        selectedProducts || [],
        totalBasePrice ?? 0,
        totalGSTAmount ?? 0,
        totalAmount ?? 0,
        paymentMethod,
        halfGSTPercentage,
        halfGstAmount
      );
      if (filePath) {
        await Share.open({
          url: `file://${filePath}`,
          type: "application/pdf",
          title: "Invoice",
          message: `Invoice #${billNumber} - Total: ₹${totalAmount}`,
        });
      } else {
        Alert.alert("Failed to share invoice.");
      }
    } catch (error) {
      console.error("Error sharing invoice:", error);
    }
  };

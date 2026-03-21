// 🔥 AUTO GENERATE MONTHS FROM START DATE
if (tenant) {
  const start = new Date(tenant.startDate);
  const now = new Date();

  let current = new Date(start);

  while (current <= now) {
    const month = current.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    const exists = await Payment.findOne({
      tenant: tenant._id,
      month,
    });

    if (!exists) {
      await Payment.create({
        tenant: tenant._id,
        month,
        totalRent: tenant.rentAmount,
        paidAmount: 0,
        remainingAmount: tenant.rentAmount,
        status: "unpaid",
      });
    }

    current.setMonth(current.getMonth() + 1);
  }
}

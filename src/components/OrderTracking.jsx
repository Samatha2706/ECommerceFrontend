function OrderTracking({ status }) {
  const steps = [
    { value: 1, label: "Order Placed" },
    { value: 2, label: "Payment Successful" },
    { value: 3, label: "Processing" },
    { value: 4, label: "Shipped" },
    { value: 5, label: "Delivered" },
  ];

  const statusMap = {
    Pending: 1,
    Paid: 2,
    Processing: 3,
    Shipped: 4,
    Delivered: 5,
    Cancelled: 6,
  };

  const statusValue =
    typeof status === "number" ? status : statusMap[status] || 1;

  if (statusValue === 6) {
    return (
      <div className="order-tracking">
        <h3>Order Tracking</h3>

        <div className="tracking-cancelled">❌ Order Cancelled</div>
      </div>
    );
  }

  return (
    <div className="order-tracking">
      <h3>Order Tracking</h3>

      <div className="tracking-timeline">
        {steps.map((step) => {
          const completed = statusValue >= step.value;

          return (
            <div
              className={`tracking-step ${completed ? "completed" : ""}`}
              key={step.value}
            >
              <div className="tracking-circle">{completed ? "✓" : ""}</div>

              <p>{step.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderTracking;

export const getEstimatedDeliveryDate = (daysToAdd = 3): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

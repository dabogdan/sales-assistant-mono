export function getTableRow(concern, advice) {
  return {
    concern: { id: crypto.randomUUID(), value: concern },
    advice: { id: crypto.randomUUID(), value: advice },
    id: crypto.randomUUID(),
  };
}

export function simulateApiResponse(data, isError, delay = 3000) {
  return new Promise((resolve, reject) => {
    if (isError) return reject();
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
}

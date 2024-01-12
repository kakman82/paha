const niceNumber = (value) => {
  const niceVal = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(value);
  return niceVal;
};

export default niceNumber;

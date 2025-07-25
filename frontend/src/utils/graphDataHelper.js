import _ from 'lodash';

export const getTotalByCategories = (data) => {
  const totalAmount = _.sumBy(data, ({ amount }) => amount);

  const result = _(data)
    .groupBy((el) => el.category.name)
    .map((objs, key) => {
      return {
        catName: key,
        color: objs[0].category.color,
        total: _.sumBy(objs, 'amount'),
        percentage: (_.sumBy(objs, 'amount') / totalAmount) * 100,
        totalAmount: totalAmount,
      };
    })
    .value();
  return result;
};

export const getChartData = (data) => {
  let chartData = getTotalByCategories(data);

  if (!chartData || chartData.length === 0) {
    return {
      data: {
        labels: [],
        total: 0,
        percentages: [],
        datasets: [],
      },
      options: {
        cutout: '90%',
      },
    };
  }

  let config = {
    data: {
      labels: chartData.map((el) => el.catName),
      total: chartData[0].totalAmount,
      percentages: chartData.map((el) => el.percentage),
      datasets: [
        {
          data: chartData.map((el) => el.total),
          backgroundColor: chartData.map((el) => el.color),
          borderWidth: 0.5,
          hoverOffset: 2,
          spacing: 15,
        },
      ],
    },
    options: {
      cutout: '90%',
    },
  };
  return config;
};

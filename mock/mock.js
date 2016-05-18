module.exports = {
  rules: [
    {
      pattern: /\/api\/homeList.php$/,
      respondwith: './home.json'
    },
    {
      pattern: /\/api\/homeList.php\?page=\d+&pageSize=5$/,
      respondwith: './home.more.json'
    },
    {
      pattern: /\/api\/homeList.php\?page=\d+&pageSize=6$/,
      respondwith: './home.more1.json'
    },
    {
      pattern: /\/api\/homeList.php\?type=refresh$/,
      respondwith: './home.more2.json'
    },
    {
      pattern: /\/api\/getDetail.php\?id=\d+$/,
      respondwith: './detail.json'
    }
  ]
};

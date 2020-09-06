const imageReq = require.context('./', false, /\.png$/);

const images = imageReq.keys().reduce((acc, path) => {
  acc[path.replace('./', '').replace('.png', '')] = imageReq(path);
  return acc;
}, {});

export default images;

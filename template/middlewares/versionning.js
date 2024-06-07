const versions = {
  v1: require("../controllers/v1.game.js"),
  v2: require("../controllers/v2.game.js"),
};



module.exports = (req, res, next) => {
  const version = (req.headers["accept-version"] || v2).trim();

  if (versions[version]) {
    req.version = version;

    next();
  } else {
    res.status(404).json({ error: "Version not found" });
  }
};

/*module.exports = (req, res, next) => {
    console.log('req.headers["accept-version"]:', req.headers["accept-version"]);
    const version = (req.headers["accept-version"] || "v2").trim();
    console.log('version:', version);
  
    console.log('versions[version]:', versions[version]);
  
    if (versions[version]) {
      req.version = version;
      console.log('Calling next()...');
      next();
      console.log('Next() called...');
    } else {
      res.status(404).json({ error: "Version not found" });
    }
  };*/
const exp = require('express')
const fs = require('fs')
const config = require(`./config.json`);
const port = config.port | 8003;
const web = exp();

checkAndCreate();
function checkAndCreate(){
  if(!fs.existsSync("./files")) fs.mkdirSync("./files");
}

web.use("/files", async (req, res) => {
  if(req.query.path == null) return;
  var file = decodeURI(`${__dirname.replaceAll(`\\`, `/`)}/files${req.query.path.replaceAll("../", "")}`.replaceAll("%20", " "));
  console.log(`${req.query.path.replaceAll("../", "")}`)
  // console.log(file)
  if(fs.existsSync(file)){
    if(fs.lstatSync(file).isDirectory()){
      let hell = [];
      await fs.readdir(file, (err, files) => {
        files.forEach(fileDir => {
          hell.push({
            name: fileDir,
            path: encodeURI(`${config.domain}${`${req.query.path}/${fileDir}`.replaceAll("\\", "/").replaceAll("//", "/").replaceAll("../", "")}`),
            isDir: fs.lstatSync(`${file}/${fileDir}`).isDirectory()
          })
          // console.log(fileDir)?
        });
        res.json(hell);
      });
    } else {
      res.json({"message": "this file"})
    }
  } else res.json({"message": "not found"});
})
web.use('/', exp.static('www'));
web.use('/', exp.static('files'));
web.use(async (req, res, next)=>{
  req.port = port == 80 ? `` : `:${port}`;
  var ip = req.ip;
  res.setHeader("Access-Control-Allow-Origin", '*')
  console.log(`---\nЗапрос от ${ip} \nURL: ${req.protocol}://${req.hostname}${req.port}${req.url}`)
  let path = decodeURI(`${__dirname.replaceAll(`\\`, `/`)}/files/${req.path.replaceAll("../", "")}`.replaceAll("\\", "/").replace("//", "/").replace("%20", " "));
  if(!fs.existsSync(path)) {
    res.json({message: "File not found!"})
    return;
  }
  if(fs.lstatSync(path).isDirectory()) res.sendFile(`${__dirname.replaceAll(`\\`, `/`)}/www/index.html`);
  else next();
})

web.listen(port, () => {
    console.log("| Site up!")
})
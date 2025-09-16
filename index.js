import express from "express";
import cors from "cors";
import dbConnect from "./db.js";
import config from "./config.js";
import morgan from "morgan";
import bodyParser from "body-parser";


const app = express();
const port = config.PORT;


app.set("trust proxy",true);
morgan.token("remote-addr",function (req,res){
    return req.headers['x-forwarded-for'] || req.socket.remoteAddress;
});

morgan.token("url",(req)=>{
    const url = new URL(req.url,`http://${req.headers.host}`);
    return req.originalUrl
})

app.use(morgan(':remote-addr :method :url :status :res[content-length] - :response-time ms'));


//middlewares
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.json({ limit:'10mb'}));
app.use(express.json({limit:'100mb'}));
app.use(express.urlencoded({limit:'100mb', extended: true }));

// Error handling middleware for JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON input" });
  }
  next(err); // Pass to the next middleware if not a JSON error
});

// Default error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.use("*", (req, res) => {
  res.status(403).json({
    message: "not found",
  });
});

//Database connection
dbConnect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.log("Unable to connected server", error);
  });
 


import express from 'express';

const app = express();


app.use("/", (req,res) => {
    res.send("Hello From homepage")
});

app.listen(5000, () => {
    console.log("Http Server running at http://localhost:5000");
})
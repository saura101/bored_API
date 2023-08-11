import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Step 1: Make sure that when a user visits the home page,
//   it shows a random activity.You will need to check the format of the
//   JSON data from response.data and edit the index.ejs file accordingly.
app.get("/", async (req,res)=> {
  try{
    const response= await axios.get("https://bored-api.appbrewery.com/random");
    const result=response.data;
    console.log(result);
    res.render("index.ejs",{ data:result }); 
  } catch(error) {
    console.error("Failed to make request:",error.message);
    res.render("index.ejs", { error:error.message });
  }
});


app.post("/", async (req, res) => {
  console.log(req.body);
  // Step 2: Play around with the drop downs and see what gets logged.
  let url="https://bored-api.appbrewery.com/";
  let endpoint;
  // Use axios to make an API request to the /filter endpoint. Making
  if(req.body.type=='' && req.body.participants=='')
    endpoint="random";
  else if(req.body.type=='')
    endpoint="filter?participants="+req.body.participants;
  else if(req.body.participants=='')
    endpoint="filter?type="+req.body.type;
  else
    endpoint="filter?type="+req.body.type+"&participants="+req.body.participants;
  // sure you're passing both the type and participants queries.
  try{
    const response = await axios.get(url+endpoint);
    const result=response.data;
    let final;
    if(Array.isArray(result))
    {
      let select=Math.floor(Math.random()*result.length);
      final=result[select];
    }
    else
    {
      final=result;
    }
    console.log(final);
    res.render("index.ejs", { data:final });
  } catch(error){
    console.error("Failed to make request:",error.message);
    let msg="No activities that match your criteria";
    res.render("index.ejs", { error:msg });
  }
  // Render the index.ejs file with a single *random* activity that comes back
  // from the API request.
  // Step 3: If you get a 404 error (resource not found) from the API request.
  // Pass an error to the index.ejs to tell the user:
  // "No activities that match your criteria."
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

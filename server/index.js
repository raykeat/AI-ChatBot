//using commonJS style of importing, as Pool from "pg" library can only be imported using commonJS
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const pgPromise = require("pg-promise");
const pool = require("./database");
console.log(`DB_USER: ${process.env.DB_USER}`);


/*Configurations */
const app = express();
app.use(express.json());
app.use(cors());

/*configure middleware to handle incoming HTTP requests by parsing the request body */
//parse JSON-formatted data in the request body
app.use(bodyParser.json({limit: "30mb", extended: true}));
//parse data submitted through HTML forms
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));



//OpenAI API setup
//importing various OpenAI libraries
const { Configuration } = require("openai");
const { OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);

//const openai = new OpenAIApi({
  // replace your-api-key with your API key from ChatGPT
  //apiKey: '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'
//})


//ROUTES
//test route to create random user
app.post("/randomuser", async (req, res)=>{

  try{
    // Inserting random user into the Users table by using the pool object to query the database
    const newuser = await pool.query(    
      "INSERT INTO users (username, password) VALUES ('ray', '88banana')"
    );

    res.status(200).json(newuser);
  }

  catch(error){
    res.status(400).json(error);
    console.log(error);
  }
})

//route to save a new chat into database
app.post("/newchat", async(req, res)=>{

  try{
    //Inserting new chat into the Chats table by using pool object to perform database queries
    const newchat = await pool.query(
      "INSERT INTO chats (summary, user_id) VALUES ($1, $2) RETURNING *",
      [req.body.summary, 1]
    );
    res.status(200).json(newchat.rows[0]);
  }

  catch(error){
    res.status(400).json(error);
    console.log(error);
  }
})

//route to save new messages for a chat into database
app.post("/newmessages", async(req, res)=>{
  console.log(req.body);
  const { chatId, unsavedMessages } = req.body;

  try{

    //Inserting new messages into the Messages table by using pool object to perform database queries
    for (const unsavedmessage of unsavedMessages){
      await pool.query(
        "INSERT INTO messages (chat_id, type, message, saved) VALUES ($1, $2, $3, $4)",
        [chatId, unsavedmessage.type, unsavedmessage.message, true]
      );
      unsavedmessage.saved = true;
    }

    res.status(200).json({ message: 'Chathistory saved successfully' });
  }

  catch(error){
    res.status(400).json({message: error});
  }
})

//route to retrieve chat summaries for left navigation bar (on frontend)
app.get("/retrievechats", async (req, res)=>{

  try{
    //retrieving chat summaries from chats table by using pool object
    const chatSummaries = await pool.query(`
      SELECT id, summary FROM chats 
      ORDER BY created_at DESC
    `);
    res.status(200).json(chatSummaries);
  }
  catch(error){
    res.status(500).json(error);
  }
})


//route to get response from chatGPT based on user's query
app.post("/ask", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    if (prompt == null) {
      throw new Error("Uh oh, no prompt was provided");
    }

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 500,
    });

    const completion = response.data.choices[0].text;

    return res.status(200).json({
      success: true,
      message: completion,
    });
  } 
  
  catch (error) {
    return res.json(error);
    console.log(error);
  }
});



//process.env is an object in Node.js that provides access to environment variables. 
const PORT = process.env.PORT || 6001;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`)
});

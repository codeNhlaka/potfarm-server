const express = require("express");
const app = express();
const cors = require('cors');
const sendMail = require("./email-configuration/email-config");

// config dotenv...

const dotenv = require("dotenv");
      dotenv.config();

// set up middleware...

app.use(cors());
app.use(express.json());

// handle requests...

app.post("/subscribe-email", async (req, res) => {
    
    const { email } = req.body;
    
    // check if email is present, if not - return;

    if (!email) {
        res.status(500).json({
            message: "missing email"
        });

        return;
    }

    // subscribe email to mailchimp audience

    const axios = require("axios").default;

    axios.defaults.headers.post['Authorization'] =`auth ${process.env.M_KEY}`;

    const mailchimpBaseUrl = `https://us20.api.mailchimp.com/3.0/lists/${process.env.AUDIENCE_ID}`;

    const reqBody = {
        members: [{
        email_address: email,
        status: 'subscribed',
    }],
        update_existing: true
    }

    const reqURL = `${mailchimpBaseUrl}?skip_merge_validation=true&skip_duplicate_check=false`;

    axios.post(reqURL, reqBody).then((response) => {
        // get mId from the payload...
        const subscriber = response.data["new_members"];
        const mId = subscriber[0].id;

        if (mId){
            // do anything with the id - eg. store in db for tracking


            //...statement
        }

    }).catch(error => {
        console.log(error)
        res.sendStatus(500);

        return;
    });


    // TODO: make sure to configure nodemailer before sending emails
    // FIXME: once nodemailer is configured, set the second arg to false

    const messageId = sendMail(email, true);
        
    if (messageId) {
        const response = {
            messageId,
            subscribed: true
        }

        res.json(response);
        return;
    }

    const response = {
        subscribed: true
    }

    res.json(response);
});

const port = process.env.PORT || 4040;
app.listen(port, () => console.log(`App running at port ${port}`));

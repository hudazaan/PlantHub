
import express from 'express';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import stripePackage from 'stripe'; 
// import * as fs from 'fs'; 
import bodyParser from 'body-parser';
import mongoose from 'mongoose'; 
import userRouter from './routes/user.js'


const __dirname = dirname(fileURLToPath(import.meta.url));

config();

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

//server start
const app = express(); 

app.use(bodyParser.json()); 

app.use('/api',userRouter)

mongoose.connect(
    process.env.MONGO_URI,{
        dbName: "Ecommerce_Plant",  
    }
).then(()=>console.log("MongoDB is Connected!!")).catch(
    (err)=>console.log(err.message));

app.use(express.static("website"));
app.use(express.json());  

//home route
app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "website" });
});
//successful
app.get("/successful", (req, res) => {
    res.sendFile("successful.html", { root: "website" });
}); 
//failure 
app.get("/rejected", (req, res) => {
    res.sendFile("rejected.html", { root: "website" });
});



app.get("/login", (req, res) => {
    res.sendFile("rejected.html", { root: "website" });
});
app.get("/register", (req, res) => {
    res.sendFile("rejected.html", { root: "website" });
});



//route to handle form submission
app.post("/send-message", (req, res) => {
    const formData = [];
    const { name, email, subject, message } = req.body;

    // console.log('Form Data:', req.body);    
    formData.push({ name, email, subject, message })
    res.send("Message received successfully!"); 
});


app.post("/stripe-checkout", async (req, res) => {
    const lineItems = req.body.items.map((item) => {
        const unitAmount = parseInt(item.price.replace(/[^0-9.-]+/g, "") * 100);
        console.log("item-price:", item.price); 
        console.log("unitAmount:", unitAmount); 
        return {
            price_data: {
                currency: "inr", 
                product_data: {
                    name: item.title,
                    images: [item.productImg]
                },
                unit_amount: unitAmount,  
            },
            quantity: item.quantity,
        }
    }); 
   console.log("lineItems:", lineItems); 

//checkout session 
try {
const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"], 
    mode: "payment", 
    success_url: `${process.env.DOMAIN}/successful`, 
    cancel_url: `${process.env.DOMAIN}/rejected`, 
    line_items: lineItems, 

    billing_address_collection: "required", 
  }); 
  res.json(session.url); 
} catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).send("Internal Server Error");
}
});

//check port for server
app.listen(3001, () => {
    console.log("Listening on Port 3001;");
});

 

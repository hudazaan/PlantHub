
import express from 'express';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import stripePackage from 'stripe'; 
import { readFile, writeFile } from 'fs/promises';
import bodyParser from 'body-parser';
import mongoose from 'mongoose'; 
import userRouter from './routes/user.js'


const __dirname = dirname(fileURLToPath(import.meta.url));

config();

const PORT = Number(process.env.PORT) || 3000;
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
    res.sendFile("login.html", { root: "website" });
});
app.get("/register", (req, res) => {
    res.sendFile("register.html", { root: "website" });
});


async function saveFormMessage(data) {
    const filePath = join(__dirname, 'formData.json');
    let records = [];

    try {
        const file = await readFile(filePath, 'utf8');
        records = file.trim() ? JSON.parse(file) : [];
    } catch (error) {
        records = [];
    }

    records.push(data);
    await writeFile(filePath, JSON.stringify(records, null, 2), 'utf8');
}



//route to handle form submission
app.post("/send-message", async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        await saveFormMessage({ name, email, subject, message, createdAt: new Date().toISOString() });
        res.send("Message received successfully!");
    } catch (error) {
        console.error('Error saving form data:', error);
        res.status(500).send('Unable to save message');
    }
});


app.post("/stripe-checkout", async (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
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
    success_url: `${baseUrl}/successful`, 
    cancel_url: `${baseUrl}/rejected`, 
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
app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT};`);
});

 

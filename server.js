const express = require("express");
const ejs = require("ejs");
const app = express();
const { connectToDb, getDb } = require("./db");
const { ObjectId } = require("mongodb");
let port = process.env.PORT ||3000;

// Middleware
app.set("view-engine", "ejs");
app.use(express.static("Public"));

let db;
connectToDb((err) => {
	if (!err) {
		app.listen(port, () => {
			console.log("Server is live at port "+port+"!");
		});
		db = getDb();
	} else {
		console.error("There was an error connecting to the database?");
	}
});

// Routes

app.get("/", (req, res) => {
	let products = [];
	let data = {
		products: products,
	};
	db.collection("Products")
		.find()
		.sort()
		.forEach((prod) => products.push(prod))
		.then(() => {
			res.status(200).render("index.ejs", data);
		})
		.catch(() => {
			res.status(500).json({
				error: "Could not fetch the document",
			});
		});
});

app.get("/edit/:id", (req, res) => {
	if (ObjectId.isValid(req.params.id)) {
		db.collection("Products")
			.findOne({ _id: new ObjectId(req.params.id) })
			.then((doc) => {
				res.status(200).json(doc);
			})
			.catch((err) => {
				res.status(500).json({ error: "Could not fetch the docuent" });
			});
	} else {
		res.status(500).json({ error: "Not a valid document Id" });
	}
});

app.get("/product/:id", (req, res) => {
	if (ObjectId.isValid(req.params.id)) {
		
		
		db.collection("Products")
			.findOne({ _id: new ObjectId(req.params.id) })
			.then((item) => {
				
				res.status(200).render("product.ejs",{item:item});
			})
			.catch((err) => {
				res.status(500).json({ error: "Could not fetch the docuent" });
			});
	} else {
		res.status(500).json({ error: "Not a valid document Id" });
	}
});

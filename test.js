

// Handling GET /send Request
app.get("/send", async (req, res, next) => {
	try {
		let { page, size, sort } = req.query;

		// If the page is not applied in query
		if (!page) {

			// Make the Default value one
			page = 1;
		}

		if (!size) {
			size = 10;
		}

		// We have to make it integer because
		// the query parameter passed is string
		const limit = parseInt(size);

		// We pass 1 for sorting data in
		// descending order using ids
		const user = await User.find().sort(
			{ votes: 1, _id: -1 }).limit(limit)

		res.send({
			page,
			size,
			Info: user,
		});
	}
	catch (error) {
		res.sendStatus(500);
	}
});



class Controller {
    getAll(req, res) {
        // Logic to get all items
        res.send('Get all items');
    }

    getById(req, res) {
        const id = req.params.id;
        // Logic to get an item by id
        res.send(`Get item with id: ${id}`);
    }
}

module.exports = Controller;
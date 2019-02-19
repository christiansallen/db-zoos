const express = require("express");
const helmet = require("helmet");
const knex = require("knex");

const knexConfig = {
  client: "sqlite3",
  connection: {
    filename: "./data/lambda.sqlite3"
  },
  useNullAsDefault: true
};
const db = knex(knexConfig);

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here
server.get("/api/zoos", (req, res) => {
  db("zoos")
    .then(zoo => {
      res.status(200).json(zoo);
    })
    .catch(() => res.status(500).json({ message: "There was an error" }));
});

server.get("/api/zoos/:id", (req, res) => {
  const { id } = req.params;
  db("zoos")
    .where({ id: id })
    .then(zoo => {
      if (zoo.length > 0) {
        res.status(200).json(zoo);
      } else {
        res.status(404).json({ message: "Cannot find data with that id." });
      }
    })
    .catch(() => {
      res.status(500).json({ message: "There was an error." });
    });
});

server.post("/api/zoos", (req, res) => {
  const { id, name } = req.body;
  if (!name) {
    res.status(400).json({ message: "Please insert a name." });
  } else {
    db("zoos")
      .insert({ id, name })
      .then(zoo => {
        {
          res.status(201).json(zoo);
        }
      })
      .catch(() => res.status(500).json({ message: "There was an error." }));
  }
});

server.delete("/api/zoos/:id", (req, res) => {
  const { id } = req.params;
  db("zoos")
    .where({ id: id })
    .del()
    .then(zoo => {
      if (zoo) {
        res.status(204).json({ message: "The zoo was successfully deleted" });
      } else {
        res
          .status(400)
          .json({ message: "There is nothing to delete with that id." });
      }
    })
    .catch(() => res.status(500).json({ message: "There was an error." }));
});

server.put("/api/zoos/:id", (req, res) => {
  const { id } = req.params;
  db("zoos")
    .where({ id: id })
    .update(req.body)
    .then(zoo => {
      if (zoo) {
        res.status(200).json(zoo);
      } else {
        res.status(404).json({ message: "That ID does not exist" });
      }
    })
    .catch(() => res.status(500).json({ message: "There was an error" }));
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});

const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

const validateRepositoryIndex = (request, response, next) => {
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  request.repositoryIndex = repositoryIndex;
  return next();
};

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);
  
  return response.json(repository);
});

app.put("/repositories/:id",validateRepositoryIndex ,(request, response) => {
  const { repositoryIndex } = request;
  const { title, url, techs } = request.body;
  const repository = { ...repositories[repositoryIndex], title, url, techs };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", validateRepositoryIndex, (request, response) => {
  const { repositoryIndex } = request;

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateRepositoryIndex, (request, response) => {
  const { repositoryIndex } = request;

  const likes = ++repositories[repositoryIndex].likes;

  return response.json({ likes: likes });
});

module.exports = app;

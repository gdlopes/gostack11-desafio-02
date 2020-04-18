const express = require('express');
const cors = require('cors');

const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { url, title, techs } = request.body;

  const repository = {
    id: uuid(),
    url,
    title,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { url, title, techs } = request.body;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Its not a valid id' });
  }

  const repositoryIndex = repositories.findIndex(r => r.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: 'Repository not found' });
  }

  const { likes } = repositories[repositoryIndex];

  const repository = {
    id,
    url,
    title,
    techs,
    likes
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Its not a valid id' });
  }

  const repositoryIndex = repositories.findIndex(r => r.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: 'Repository not found' });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).json();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Its not a valid id' });
  }

  const repositoryIndex = repositories.findIndex(r => r.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: 'Repository not found' });
  }

  repositories[repositoryIndex].likes++;

  const { likes } = repositories[repositoryIndex];

  return response.json({ likes });
});

module.exports = app;

const express =  require('express');
const app = express();
const PORT = 3000;

const { getAllPosts, createPost, addLike, deletePost, getPost } = require('./services/posts');

app.use(express.json()) //middleware para parsear el cuerpo de la consulta
app.use(express.static("public")); //middleware para servir archivos estáticos

const verifyPost = async(req, res, next) => {
  const { id }  = req.params;
  try {
    console.log('entro a try')
    await getPost(id);
    next();
  } catch (error) {
    console.log('entro a este error');
    res.status(404).send(`No hay ningún post con el id ${id}`);
  }
};

app.get("/", (req, res) => {
  try {
    res.sendFile();
  } catch (error) {
    res.json({ message: "error, faltan datos" });
  }
});

app.get("/posts", async (req, res) => {
  try {
    const getPosts = await getAllPosts();
    res.json(getPosts);
  } catch (error) {
    console.log(error);
  }
});

app.post("/posts", async (req, res) => {
  try {
    const { titulo, url, descripcion } = req.body;
    await createPost(titulo, url, descripcion);
    res.send("Post creado");
  } catch (error) {
    console.log(error);
  }
});

app.put('/posts/like/:id', verifyPost, async (req, res) => {
  const { id } = req.params;
  try {
    await addLike(id);
    res.send('like added');
  } catch (error) {
    res.send(error);
  }
});

app.delete('/posts/:id', verifyPost, async (req, res) => {
  const { id } = req.params;
  try {
    await deletePost(id);
    res.send('post deleted');
  } catch (error) {
    res.send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Estoy escuchando el puerto ${PORT}`);
});
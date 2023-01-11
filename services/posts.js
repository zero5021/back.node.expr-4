const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: '1234',
  database: 'likeme',
  allowExitOnIdle: true  
});

const getAllPosts = async() => {
  const { rows } = await pool.query("SELECT * FROM posts");
  return rows;
};

const getPost = async(id) => {
  const consulta = "SELECT FROM posts WHERE id = $1";
  const values = [id];
  const result = await pool.query(consulta, values);
  const [viaje] = result.rows;
  if ( viaje.lenght === 0 ) {
    throw { code: 404, message: `No hay ningún viaje con el id ${id}` }
  } else {
    return viaje;
  };
}

const createPost = async (titulo, img, descripcion) => {
  const consulta = "INSERT INTO posts values (DEFAULT, $1, $2, $3)";
  const values = [titulo, img, descripcion];
  const result = await pool.query(consulta, values);
};

const addLike = async (id) => {
  const consulta = 'UPDATE posts SET likes = (case when likes IS NULL then 1 else likes + 1 end) WHERE id = $1;'
  const values = [id];
  const { rowCount } = await pool.query(consulta, values)
    if (rowCount === 0) {
        throw { code: 404, message: `No hay viajes con el id ${id}` }
    }
};

const deletePost = async(id) => {
  const consulta = 'DELETE FROM posts WHERE id = $1'
  const values = [id];
  const result = await pool.query(consulta, values);
};

module.exports = { getAllPosts, createPost, addLike, deletePost, getPost };
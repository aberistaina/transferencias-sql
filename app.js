import express from "express"
import pkg from "pg"
import path from "path";
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
dotenv.config();
const port = 3000
app.use(express.static(path.resolve("public")))

let { Pool } = pkg

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});


app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});

app.get("/", (req, res) =>{
    res.sendFile(path.resolve('index.html'))
})

app.get("/api/datos", async(req, res) => {
    let query = {
        text: "SELECT * FROM usuarios ORDER BY nombre ASC"
    }
    let datos = await pool.query(query)
    res.json(datos.rows);
});

app.post("/api/transferencias", async(req,res)=>{
    try {
        let { rutOrigen, rutDestino, monto } = req.body
        console.log(req.body)



        let consultaRestarDinero = {
            text: "UPDATE usuarios SET saldo = saldo - $1 WHERE rut = $2",
            values: [monto, rutOrigen]
        }

        let consultaSumarDinero = {
            text: "UPDATE usuarios SET saldo = saldo + $1 WHERE rut = $2",
            values: [monto, rutDestino]
        }
        await pool.query("BEGIN")
        await pool.query(consultaRestarDinero)
        await pool.query(consultaSumarDinero)
        await pool.query("COMMIT")
        
        res.json("transferencia recibida")
    } catch (error) {
        console.log(error.message)
    }

})

app.post("/api/saldo", async(req,res)=>{
    try {
        let {rut} = req.body
        let consulta = {
            text: "SELECT * FROM usuarios WHERE rut = $1",
            values: [rut]
        }
        let respuesta = await pool.query(consulta)
        let usuario = respuesta.rows[0]
        res.json(usuario)
    } catch (error) {
        console.log(error.message)
    }
})
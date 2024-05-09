const express = require('express')
const prettify = require('express-prettify')

const app = express()

app.use(prettify({ query: 'pretty' }))

const { productos, automoviles } = require('./routes')

app.get('/productos', (req, res) => {
  res.json(productos)
})

app.get('/productos/categoria?categoria=Panadería', (req, res) => {
  //http://localhost:3000/productos/categoria?categoria=Panadería
  const categoriaQuery = req.query.categoria
  if (categoriaQuery) {
    const filtrados = productos.filter(
      (producto) =>
        producto.categoria.toLowerCase() === categoriaQuery.toLowerCase()
    )
    res.json(filtrados)
  } else {
    res.status(400).json({ error: 'Categoría no especificada' })
  }
})

app.get('/automoviles', (req, res) => {
  //http://localhost:3000/automoviles
  res.json(automoviles)
})

app.get('/productos/caro', (req, res) => {
  //http://localhost:3000/productos/caro
  const caros = productos.filter((producto) => producto.valor > 10000)
  res.json(caros)
})

app.get('/productos/iva', (req, res) => {
  //http://localhost:3000/productos/iva
  const conIva = productos.map((producto) => ({
    ...producto,
    valorConIva: producto.valor * 1.19,
  }))
  res.json(conIva)
})

app.get('/automoviles/marca', (req, res) => {
  //http://localhost:3000/automoviles/marca?marca=kia
  const marca = req.query.marca
  if (!marca) {
    return res.status(400).json({ error: 'Debe proporcionar una marca' })
  }
  const porMarca = automoviles.filter(
    (auto) => auto.marca.toLowerCase() === marca.toLowerCase()
  )
  res.json(porMarca)
})

app.get('/automoviles/impuesto', (req, res) => {
  //http://localhost:3000/automoviles/impuesto
  const conImpuesto = automoviles.map((auto) => {
    let impuesto
    if (auto.tipo === 'Gasolina') {
      const valor = parseFloat(auto.valor)
      if (valor <= 50000000) impuesto = valor * 0.01
      else if (valor <= 100000000) impuesto = valor * 0.015
      else if (valor <= 150000000) impuesto = valor * 0.025
      else impuesto = valor * 0.035
    } else if (auto.tipo === 'Eléctrico') {
      impuesto = parseFloat(auto.valor) * 0.01
    }
    return {
      ...auto,
      impuesto,
    }
  })
  res.json(conImpuesto)
})

app.get('/automoviles/tipo', (req, res) => {
  //http://localhost:3000/automoviles/tipo?tipo=H%C3%ADbrido
  const { tipo } = req.query
  if (!tipo) {
    return res.status(400).json({ error: 'Tipo de automóvil no especificado' })
  }
  const filtrados = automoviles.filter(
    (auto) => auto.tipo && auto.tipo.toLowerCase() === tipo.toLowerCase()
  )
  res.json(filtrados)
})

app.get('/productos/fecha-expiracion', (req, res) => {
  //http://localhost:3000/productos/fecha-expiracion?mes=5
  const { mes } = req.query
  const filtrados = productos.filter(
    (producto) =>
      new Date(producto.fechaVencimiento).getMonth() + 1 === parseInt(mes)
  )
  res.json(filtrados)
})
// 5 extras para cada uno
app.get('/automoviles/color', (req, res) => {
//http://localhost:3000/automoviles/color?color=rojo
  const { color } = req.query;
  const filtrados = automoviles.filter(auto => auto.color.toLowerCase() === color.toLowerCase());
  res.json(filtrados);
});

app.get('/automoviles/cilindraje', (req, res) => {
    const { min, max } = req.query;
    const filtrados = automoviles.filter(auto => auto.cilindraje >= min && auto.cilindraje <= max);
    res.json(filtrados);
});

app.get('/automoviles/ordenar-marca', (req, res) => {
  const ordenados = automoviles.slice().sort((a, b) => a.marca.localeCompare(b.marca));
  res.json(ordenados);
});

app.get('/automoviles/placa-reciente', (req, res) => {
  const { años } = req.query;
  const currentYear = new Date().getFullYear();
  const filtrados = automoviles.filter(auto => parseInt(auto.placa.slice(-4)) > currentYear - años);
  res.json(filtrados);
});

app.get('/automoviles/combustible', (req, res) => {
  //http://localhost:3000/automoviles/combustible?tipo=el%C3%A9ctrico
  const { tipo } = req.query;
  const filtrados = automoviles.filter(auto => auto.tipo.toLowerCase() === tipo.toLowerCase());
  res.json(filtrados);
});

app.get('/productos/descripcion', (req, res) => {
  const { keyword } = req.query;
  const filtrados = productos.filter(producto => producto.descripcion.toLowerCase().includes(keyword.toLowerCase()));
  res.json(filtrados);
});

app.get('/productos/vencen-este-año', (req, res) => {
  const year = new Date().getFullYear();
  const filtrados = productos.filter(producto => new Date(producto.fechaVencimiento).getFullYear() === year);
  res.json(filtrados);
});

app.get('/productos/ordenar-vencimiento', (req, res) => {
  const ordenados = productos.slice().sort((a, b) => new Date(b.fechaVencimiento) - new Date(a.fechaVencimiento));
  res.json(ordenados);
});

app.get('/productos/buscar', (req, res) => {
  const { nombre } = req.query;
  const filtrados = productos.filter(producto => producto.nombre.toLowerCase().includes(nombre.toLowerCase()));
  res.json(filtrados);
});

app.get('/productos/rango-precio', (req, res) => {
  const { min, max } = req.query;
  const filtrados = productos.filter(producto => producto.valor >= min && producto.valor <= max);
  res.json(filtrados);
});

app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000')
})

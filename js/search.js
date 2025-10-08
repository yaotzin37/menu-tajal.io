// Datos estructurados del menú Tajal
const menuData = [
    // DESAYUNOS
    {
        nombre: "Chilaquiles",
        descripcion: "Rojos o verdes, acompañados de frijoles, queso, crema y cebolla",
        precio: "$130.00",
        categoria: "Desayunos",
        imagen: "assets/galeria-platillos/desayunos/chilaquiles.jpeg",
        tipo: "platillo"
    },
    {
        nombre: "Huevos al gusto",
        descripcion: "Mexicana, Revueltos, Con jamón, Estrellados, Omelette con salchicha o jamón",
        precio: "$120.00",
        categoria: "Desayunos",
        imagen: "",
        tipo: "platillo"
    },
    {
        nombre: "Hot-cakes",
        descripcion: "3 piezas con mantequilla, miel de maple y tocino",
        precio: "$115.00",
        categoria: "Desayunos",
        imagen: "assets/galeria-platillos/desayunos/hot-cakes.jpeg",
        tipo: "platillo"
    },
    {
        nombre: "Plato de fruta",
        descripcion: "Papaya, melón, fresas, con miel de abeja y granola; elegir: queso cottage o yogurt natural",
        precio: "$120.00",
        categoria: "Desayunos",
        imagen: "assets/galeria-platillos/desayunos/plato_de_fruta.jpeg",
        tipo: "platillo"
    },
    {
        nombre: "Molletes salados",
        descripcion: "2 molletes: frijol con queso, frijol con queso y chorizo",
        precio: "$90.00",
        categoria: "Desayunos",
        imagen: "assets/galeria-platillos/desayunos/molletes_salados.jpeg",
        tipo: "platillo"
    },
    {
        nombre: "Molletes Dulces",
        descripcion: "2 molletes: sencillo o combinado con cajeta, mermelada de fresa, lechera, Nutella, azúcar y canela, miel",
        precio: "$95.00",
        categoria: "Desayunos",
        imagen: "",
        tipo: "platillo"
    },

    // ENTRADAS
    {
        nombre: "Guacamole con picaña",
        descripcion: "Guacamole tradicional con puntas de picaña al carbón",
        precio: "$250.00",
        categoria: "Entradas",
        imagen: "assets/galeria-platillos/entradas/guacamole_con_picana.webp",
        tipo: "platillo"
    },
    {
        nombre: "Panela asada",
        descripcion: "Panela asada al carbón marinada con chimichurri",
        precio: "$120.00",
        categoria: "Entradas",
        imagen: "assets/galeria-platillos/entradas/panela_asada.jpeg",
        tipo: "platillo"
    },
    {
        nombre: "Chistorra asada",
        descripcion: "Porción de chistorra asada al carbón marinada con chimichurri",
        precio: "$130.00",
        categoria: "Entradas",
        imagen: "assets/galeria-platillos/entradas/chistorra_asada.jpeg",
        tipo: "platillo"
    },
    {
        nombre: "Tiradito de atún",
        descripcion: "Láminas de atún sobre ruedas de pepino, chile serrano y salsa sweet ponzu",
        precio: "$230.00",
        categoria: "Entradas",
        imagen: "",
        tipo: "platillo"
    },
    {
        nombre: "Cecina",
        descripcion: "150g horneada con guacamole tradicional",
        precio: "$240.00",
        categoria: "Entradas",
        imagen: "assets/galeria-platillos/entradas/cecina.jpeg",
        tipo: "platillo"
    },
    {
        nombre: "Tostadas de atún",
        descripcion: "1 tostada de atún marinado en salsa negra con flor de aguacate",
        precio: "$120.00",
        categoria: "Entradas",
        imagen: "assets/galeria-platillos/entradas/tostadas_de_atun.jpeg",
        tipo: "platillo"
    },
    {
        nombre: "Sopa Azteca",
        descripcion: "Sopa de tortilla con aguacate, queso manchego y crema",
        precio: "$95.00",
        categoria: "Entradas",
        imagen: "",
        tipo: "platillo"
    },
    {
        nombre: "Torre Tajal de atún",
        descripcion: "Atún rojo en trozos sobre aguacate",
        precio: "$280.00",
        categoria: "Entradas",
        imagen: "assets/galeria-platillos/entradas/torre_tajal_de_atun.jpeg",
        tipo: "platillo"
    },
    {
        nombre: "Queso fundido",
        descripcion: "Con chorizo, champiñones o natural",
        precio: "$160.00",
        categoria: "Entradas",
        imagen: "",
        tipo: "platillo"
    },
    {
        nombre: "Papa gratinada con arrachera",
        descripcion: "Papa con queso gratinado y fajitas de arrachera",
        precio: "$180.00",
        categoria: "Entradas",
        imagen: "assets/galeria-platillos/entradas/papa_gratinada_con_arrachera.jpeg",
        tipo: "platillo"
    },
    {
        nombre: "Papas a la francesa",
        descripcion: "",
        precio: "$80.00",
        categoria: "Entradas",
        imagen: "assets/galeria-platillos/entradas/papas_a_la_francesa.jpeg",
        tipo: "platillo"
    },
    {
        nombre: "Guacamole",
        descripcion: "Dip con totopos",
        precio: "$90.00",
        categoria: "Entradas",
        imagen: "",
        tipo: "platillo"
    },
    {
        nombre: "Tuétanos Tajal",
        descripcion: "3 piezas al grill con esquites y salsa de la casa",
        precio: "$270.00",
        categoria: "Entradas",
        imagen: "assets/galeria-platillos/entradas/tuetanos_tajal.jpg",
        tipo: "platillo"
    },

    // ENSALADAS
    {
        nombre: "Ensalada César",
        descripcion: "Mix de lechugas, crotones, queso parmesano, aderezo César y pollo",
        precio: "$180.00",
        categoria: "Ensaladas",
        imagen: "",
        tipo: "platillo"
    },
    {
        nombre: "Ensalada Premium",
        descripcion: "Mix de lechuga, espinaca, queso de cabra, nuez garapiñada y pollo con aderezo de miel mostaza",
        precio: "$200.00",
        categoria: "Ensaladas",
        imagen: "",
        tipo: "platillo"
    },
    {
        nombre: "Ensalada Tajal",
        descripcion: "Mix de lechuga con pollo, espinaca, arándano, panela, fresa, frutos rojos y vinagreta",
        precio: "$200.00",
        categoria: "Ensaladas",
        imagen: "",
        tipo: "platillo"
    },
    {
        nombre: "Ensalada Texmex",
        descripcion: "Mix de lechuga, jitomate, elote, aguacate, cebolla morada, chips y arrachera con aderezo de chipotle",
        precio: "$200.00",
        categoria: "Ensaladas",
        imagen: "assets/galeria-platillos/ensaladas/ensalada_texmex.jpeg",
        tipo: "platillo"
    },

    // PASTAS
    {
        nombre: "Alfredo",
        descripcion: "Pasta con crema Alfredo, mantequilla y queso parmesano",
        precio: "$215.00",
        categoria: "Pastas",
        imagen: "",
        tipo: "platillo"
    },
    {
        nombre: "Arrabiata",
        descripcion: "Pasta en salsa de tomate picante con ajo, chile y aceite de oliva",
        precio: "$215.00",
        categoria: "Pastas",
        imagen: "",
        tipo: "platillo"
    },
    {
        nombre: "Bizarro",
        descripcion: "Pasta especial de la casa con ingredientes únicos",
        precio: "$215.00",
        categoria: "Pastas",
        imagen: "",
        tipo: "platillo"
    },
    {
        nombre: "Al Pesto",
        descripcion: "Pasta con salsa pesto de albahaca fresca y queso parmesano",
        precio: "$215.00",
        categoria: "Pastas",
        imagen: "",
        tipo: "platillo"
    },

    // HAMBURGUESAS
    {
        nombre: "Hamburguesa tradicional",
        descripcion: "Carne de res, queso Americano y tocino",
        precio: "$175.00",
        categoria: "Hamburguesas",
        imagen: "assets/galeria-platillos/hamburguesas/hamburgesa_tradicional.jpeg",
        tipo: "platillo"
    },
    {
        nombre: "La Consentida Tajal",
        descripcion: "de res especial de la casa con champiñones tocino espinaca y queso blanco",
        precio: "$220.00",
        categoria: "Hamburguesas",
        imagen: "assets/galeria-platillos/hamburguesas/hamburguesa_tajal.jpg",
        tipo: "platillo"
    },
    {
        nombre: "Hamburguesa de camarón",
        descripcion: "Camarones a la plancha con queso manchego",
        precio: "$215.00",
        categoria: "Hamburguesas",
        imagen: "",
        tipo: "platillo"
    },
    {
        nombre: "Hamburguesa de pollo",
        descripcion: "Pechuga de pollo y queso americano",
        precio: "$175.00",
        categoria: "Hamburguesas",
        imagen: "",
        tipo: "platillo"
    },

    // CORTES
    {
        nombre: "Arrachera 350g",
        descripcion: "Con frijoles y guacamole",
        precio: "$330.00",
        categoria: "Cortes",
        imagen: "",
        tipo: "platillo"
    },
    {
        nombre: "Rib-eye 350g",
        descripcion: "Con papa al gratin y ensalada",
        precio: "$370.00",
        categoria: "Cortes",
        imagen: "assets/galeria-platillos/cortes/rib_eye.jpeg",
        tipo: "platillo"
    },
    {
        nombre: "Picaña 350g",
        descripcion: "Con frijoles y guacamole",
        precio: "$300.00",
        categoria: "Cortes",
        imagen: "",
        tipo: "platillo"
    },
    {
        nombre: "T-bone 350g",
        descripcion: "Con champiñones al ajillo y elote amarillo",
        precio: "$370.00",
        categoria: "Cortes",
        imagen: "",
        tipo: "platillo"
    },
    {
        nombre: "Cowboy 400g",
        descripcion: "Con ensalada fresca y papitas al limón",
        precio: "$470.00",
        categoria: "Cortes",
        imagen: "",
        tipo: "platillo"
    },
    {
        nombre: "Tomahawk (1kg–1.2kg)",
        descripcion: "Con una ensalada especial de la casa",
        precio: "$1,200.00",
        categoria: "Cortes",
        imagen: "assets/galeria-platillos/cortes/tomahawk.jpg",
        tipo: "platillo"
    },

    // DEL MAR
    {
        nombre: "Aguachile negro de camarón (165g)",
        descripcion: "",
        precio: "$220.00",
        categoria: "Del Mar",
        imagen: "assets/galeria-platillos/mariscos/aguachile_verde.jpeg",
        tipo: "platillo"
    },
    {
        nombre: "Aguachile rojo de camarón (165g)",
        descripcion: "",
        precio: "$220.00",
        categoria: "Del Mar",
        imagen: "assets/galeria-platillos/mariscos/aguachile_verde.jpeg",
        tipo: "platillo"
    },
    {
        nombre: "Tacos gobernador",
        descripcion: "3 tacos de camarón gratinados con aguacate",
        precio: "$250.00",
        categoria: "Del Mar",
        imagen: "assets/galeria-platillos/mariscos/tacos_gobernador.jpeg",
        tipo: "platillo"
    },
    {
        nombre: "Salmón a las brasas",
        descripcion: "Medallón de salmón con vegetales salteados",
        precio: "$255.00",
        categoria: "Del Mar",
        imagen: "assets/galeria-platillos/mariscos/salmon_a_las_brasas.jpeg",
        tipo: "platillo"
    },
    {
        nombre: "Atún sellado",
        descripcion: "Con costra de ajonjolí y ensalada fresca",
        precio: "$245.00",
        categoria: "Del Mar",
        imagen: "",
        tipo: "platillo"
    },
    {
        nombre: "Camarones al gusto",
        descripcion: "Con arroz y ensalada: a la mantequilla, a la diabla, al mojo de ajo",
        precio: "$250.00",
        categoria: "Del Mar",
        imagen: "assets/galeria-platillos/mariscos/camarones_al_ajillo.jpeg",
        tipo: "platillo"
    },
    {
        nombre: "Pulpo estilo Tajal",
        descripcion: "Pulpo a las brasas con puré de papa y ensalada",
        precio: "$420.00",
        categoria: "Del Mar",
        imagen: "assets/galeria-platillos/mariscos/pulpo_estilo_tajal.jpeg",
        tipo: "platillo"
    },
    {
        nombre: "Especial Tajal",
        descripcion: "Camarones empanizados de la casa",
        precio: "$270.00",
        categoria: "Del Mar",
        imagen: "assets/galeria-platillos/mariscos/camarones_empanizados.jpeg",
        tipo: "platillo"
    },

    // MENÚ INFANTIL
    {
        nombre: "Nuggets de pollo",
        descripcion: "Con papas a la francesa",
        precio: "$130.00",
        categoria: "Menú Infantil",
        imagen: "assets/galeria-platillos/infantil/nuggets_de_pollo.jpeg",
        tipo: "platillo"
    },
    {
        nombre: "Hot dogs",
        descripcion: "1 pieza con papas a la francesa",
        precio: "$80.00",
        categoria: "Menú Infantil",
        imagen: "",
        tipo: "platillo"
    },
    {
        nombre: "Hamburguesa infantil",
        descripcion: "Con papas a la francesa",
        precio: "$150.00",
        categoria: "Menú Infantil",
        imagen: "assets/galeria-platillos/infantil/hamburguesa_infantil.jpeg",
        tipo: "platillo"
    },
    {
        nombre: "Sopa de fideo con tocino",
        descripcion: "",
        precio: "$90.00",
        categoria: "Menú Infantil",
        imagen: "",
        tipo: "platillo"
    },

    // POSTRES
    {
        nombre: "Tarta de chocolate",
        descripcion: "",
        precio: "$135.00",
        categoria: "Postres",
        imagen: "",
        tipo: "platillo"
    },
    {
        nombre: "Cheesecake de fresa",
        descripcion: "",
        precio: "$135.00",
        categoria: "Postres",
        imagen: "",
        tipo: "platillo"
    },
    {
        nombre: "Pastel blueberry",
        descripcion: "",
        precio: "$135.00",
        categoria: "Postres",
        imagen: "",
        tipo: "platillo"
    },
    {
        nombre: "Cheesecake de zarzamora",
        descripcion: "",
        precio: "$135.00",
        categoria: "Postres",
        imagen: "",
        tipo: "platillo"
    },

    // EXTRAS
    {
        nombre: "Arrachera 150g",
        descripcion: "",
        precio: "$80.00",
        categoria: "Extras",
        imagen: "",
        tipo: "platillo"
    },
    {
        nombre: "Pollo 150g",
        descripcion: "",
        precio: "$80.00",
        categoria: "Extras",
        imagen: "",
        tipo: "platillo"
    },
    {
        nombre: "Camarón 110g",
        descripcion: "",
        precio: "$100.00",
        categoria: "Extras",
        imagen: "",
        tipo: "platillo"
    },
    {
        nombre: "Guacamole 150g",
        descripcion: "",
        precio: "$90.00",
        categoria: "Extras",
        imagen: "",
        tipo: "platillo"
    },
    {
        nombre: "Chorizo 150g",
        descripcion: "",
        precio: "$50.00",
        categoria: "Extras",
        imagen: "",
        tipo: "platillo"
    },
    {
        nombre: "Frijoles 150g",
        descripcion: "",
        precio: "$40.00",
        categoria: "Extras",
        imagen: "",
        tipo: "platillo"
    },
    {
        nombre: "Elotes (3 rebanadas)",
        descripcion: "",
        precio: "$50.00",
        categoria: "Extras",
        imagen: "",
        tipo: "platillo"
    },
    {
        nombre: "Panela 150g",
        descripcion: "",
        precio: "$50.00",
        categoria: "Extras",
        imagen: "",
        tipo: "platillo"
    },
    {
        nombre: "Orden de arroz",
        descripcion: "",
        precio: "$50.00",
        categoria: "Extras",
        imagen: "",
        tipo: "platillo"
    },

    // COCTELERÍA
    {
        nombre: "Apperol Spritz",
        descripcion: "",
        precio: "$150.00",
        categoria: "Coctelería",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Bloody Mary",
        descripcion: "",
        precio: "$130.00",
        categoria: "Coctelería",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Canija",
        descripcion: "",
        precio: "$120.00",
        categoria: "Coctelería",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Carajillo",
        descripcion: "",
        precio: "$150.00",
        categoria: "Coctelería",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Clericot",
        descripcion: "",
        precio: "$150.00",
        categoria: "Coctelería",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "El Rey Abel",
        descripcion: "",
        precio: "$170.00",
        categoria: "Coctelería",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Hierbabuena",
        descripcion: "",
        precio: "$95.00",
        categoria: "Coctelería",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Margarita",
        descripcion: "",
        precio: "$150.00",
        categoria: "Coctelería",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Margarita tajal",
        descripcion: "",
        precio: "$180.00",
        categoria: "Coctelería",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Michelada Clara",
        descripcion: "",
        precio: "$130.00",
        categoria: "Coctelería",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Michelada Obscura",
        descripcion: "",
        precio: "$150.00",
        categoria: "Coctelería",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Michelada con Camarón",
        descripcion: "",
        precio: "$180.00",
        categoria: "Coctelería",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Mimosa",
        descripcion: "",
        precio: "$130.00",
        categoria: "Coctelería",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Mojito",
        descripcion: "",
        precio: "$120.00",
        categoria: "Coctelería",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Paloma",
        descripcion: "",
        precio: "$130.00",
        categoria: "Coctelería",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Perla Negra",
        descripcion: "",
        precio: "$165.00",
        categoria: "Coctelería",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Piña Colada",
        descripcion: "",
        precio: "$150.00",
        categoria: "Coctelería",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Ruso Blanco",
        descripcion: "",
        precio: "$130.00",
        categoria: "Coctelería",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Ruso negro",
        descripcion: "",
        precio: "$150.00",
        categoria: "Coctelería",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Sangría",
        descripcion: "",
        precio: "$120.00",
        categoria: "Coctelería",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Vampiro",
        descripcion: "",
        precio: "$130.00",
        categoria: "Coctelería",
        imagen: "",
        tipo: "bebida"
    },

    // CERVEZAS
    {
        nombre: "Corona",
        descripcion: "",
        precio: "$55.00",
        categoria: "Cervezas",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Corona Light",
        descripcion: "",
        precio: "$55.00",
        categoria: "Cervezas",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Modelo Especial",
        descripcion: "",
        precio: "$75.00",
        categoria: "Cervezas",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Negra Modelo",
        descripcion: "",
        precio: "$75.00",
        categoria: "Cervezas",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Pacifico",
        descripcion: "",
        precio: "$55.00",
        categoria: "Cervezas",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Ultra",
        descripcion: "",
        precio: "$75.00",
        categoria: "Cervezas",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Victoria",
        descripcion: "",
        precio: "$55.00",
        categoria: "Cervezas",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Colimitas",
        descripcion: "",
        precio: "$95.00",
        categoria: "Cervezas Artesanales",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Colimita Lager",
        descripcion: "",
        precio: "$95.00",
        categoria: "Cervezas Artesanales",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Paromo",
        descripcion: "",
        precio: "$95.00",
        categoria: "Cervezas Artesanales",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Piedra Lisa",
        descripcion: "",
        precio: "$95.00",
        categoria: "Cervezas Artesanales",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Ticus",
        descripcion: "",
        precio: "$95.00",
        categoria: "Cervezas Artesanales",
        imagen: "",
        tipo: "bebida"
    },

    // BEBIDAS SIN ALCOHOL
    {
        nombre: "Agua Mineral Hethe",
        descripcion: "",
        precio: "$90.00",
        categoria: "Bebidas sin Alcohol",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Botella de Agua",
        descripcion: "",
        precio: "$30.00",
        categoria: "Bebidas sin Alcohol",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Café Americano",
        descripcion: "",
        precio: "$65.00",
        categoria: "Bebidas sin Alcohol",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Café Capuchino",
        descripcion: "",
        precio: "$65.00",
        categoria: "Bebidas sin Alcohol",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Café Expresso",
        descripcion: "",
        precio: "$55.00",
        categoria: "Bebidas sin Alcohol",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Chocomilk",
        descripcion: "",
        precio: "$45.00",
        categoria: "Bebidas sin Alcohol",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Jugo de Naranja",
        descripcion: "",
        precio: "$45.00",
        categoria: "Bebidas sin Alcohol",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Limonada",
        descripcion: "",
        precio: "$75.00",
        categoria: "Bebidas sin Alcohol",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Limonada 1L",
        descripcion: "",
        precio: "$140.00",
        categoria: "Bebidas sin Alcohol",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Jarra de Limonada",
        descripcion: "",
        precio: "$190.00",
        categoria: "Bebidas sin Alcohol",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Limonada de Frutos Rojos",
        descripcion: "",
        precio: "$75.00",
        categoria: "Bebidas sin Alcohol",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Naranjada",
        descripcion: "",
        precio: "$75.00",
        categoria: "Bebidas sin Alcohol",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Naranjada 1L",
        descripcion: "",
        precio: "$140.00",
        categoria: "Bebidas sin Alcohol",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Jarra de Naranjada",
        descripcion: "",
        precio: "$190.00",
        categoria: "Bebidas sin Alcohol",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Naranjada de Maracuyá",
        descripcion: "",
        precio: "$80.00",
        categoria: "Bebidas sin Alcohol",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Piñada",
        descripcion: "",
        precio: "$90.00",
        categoria: "Bebidas sin Alcohol",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Rusa (Mineral o Squirt)",
        descripcion: "",
        precio: "$60.00",
        categoria: "Bebidas sin Alcohol",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Soda Italiana",
        descripcion: "",
        precio: "$90.00",
        categoria: "Bebidas sin Alcohol",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Red Bull",
        descripcion: "",
        precio: "$100.00",
        categoria: "Bebidas sin Alcohol",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Refrescos",
        descripcion: "",
        precio: "$45.00",
        categoria: "Bebidas sin Alcohol",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Refresco 355ml",
        descripcion: "",
        precio: "$45.00",
        categoria: "Bebidas sin Alcohol",
        imagen: "",
        tipo: "bebida"
    },
    {
        nombre: "Tizanas",
        descripcion: "",
        precio: "$65.00",
        categoria: "Bebidas sin Alcohol",
        imagen: "",
        tipo: "bebida"
    }
];

// Función para buscar elementos del menú
function buscarEnMenu(query) {
    if (!query.trim()) return [];

    const queryLower = query.toLowerCase();
    return menuData.filter(item =>
        item.nombre.toLowerCase().includes(queryLower) ||
        item.descripcion.toLowerCase().includes(queryLower) ||
        item.categoria.toLowerCase().includes(queryLower) ||
        item.tipo.toLowerCase().includes(queryLower)
    );
}

// Función para mostrar resultados de búsqueda
function mostrarResultados(resultados) {
    const searchResults = document.getElementById('search-results');
    const searchStats = document.getElementById('search-stats');

    if (resultados.length === 0) {
        searchResults.innerHTML = '<p class="no-results">No se encontraron resultados para tu búsqueda.</p>';
        searchStats.textContent = '';
        return;
    }

    searchStats.textContent = `${resultados.length} resultado${resultados.length !== 1 ? 's' : ''} encontrado${resultados.length !== 1 ? 's' : ''}`;

    searchResults.innerHTML = resultados.map(item => `
        <div class="search-item ${item.tipo}" onclick="mostrarDetalle('${item.nombre}')">
            ${item.imagen ? `<img src="${item.imagen}" alt="${item.nombre}" class="search-item-image">` : '<div class="no-image"></div>'}
            <div class="search-item-info">
                <h3 class="search-item-name">${item.nombre}</h3>
                <p class="search-item-desc">${item.descripcion || 'Sin descripción'}</p>
                <div class="search-item-meta">
                    <span class="search-item-category">${item.categoria}</span>
                    <span class="search-item-price">${item.precio}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Función para mostrar detalle en modal
function mostrarDetalle(nombre) {
    const item = menuData.find(i => i.nombre === nombre);
    if (!item) return;

    const modal = document.getElementById('search-modal');
    const modalImg = document.getElementById('search-modal-img');
    const modalTitle = document.getElementById('search-modal-title');
    const modalDesc = document.getElementById('search-modal-desc');
    const modalPrice = document.getElementById('search-modal-price');
    const modalCategory = document.getElementById('search-modal-category');

    modalImg.src = item.imagen || '';
    modalImg.alt = item.nombre;
    modalTitle.textContent = item.nombre;
    modalDesc.textContent = item.descripcion || 'Sin descripción';
    modalPrice.textContent = item.precio;
    modalCategory.textContent = item.categoria;

    modal.style.display = 'block';
}

// Función para inicializar el buscador
function inicializarBuscador() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    // Buscar en tiempo real
    searchInput.addEventListener('input', function() {
        const resultados = buscarEnMenu(this.value);
        mostrarResultados(resultados);
    });

    // Buscar al hacer clic en el botón
    searchBtn.addEventListener('click', function() {
        const resultados = buscarEnMenu(searchInput.value);
        mostrarResultados(resultados);
    });

    // Buscar al presionar Enter
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const resultados = buscarEnMenu(this.value);
            mostrarResultados(resultados);
        }
    });

    // Cerrar modal
    const modal = document.getElementById('search-modal');
    const closeModal = document.getElementsByClassName('search-modal-close')[0];

    closeModal.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // Mostrar mensaje inicial
    mostrarResultados(menuData.slice(0, 20)); // Mostrar primeros 20 items inicialmente
}

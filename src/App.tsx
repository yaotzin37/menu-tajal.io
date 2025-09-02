import { useState, useEffect, useRef } from 'react';

// Define the menu data structure
interface MenuItem {
    title: string;
    description?: string;
    price: string;
}

interface MenuSubSubSection {
    title: string;
    items: MenuItem[];
}

interface MenuSubsection {
    title: string;
    items?: MenuItem[];
    subSubsections?: MenuSubSubSection[];
}

interface MenuSectionData {
    id: string;
    title: string;
    icon: string; // Font Awesome class
    headerBgColor?: string; // Custom background color for the section header
    items?: MenuItem[];
    subsections?: MenuSubsection[];
    note?: string; // For notes specific to a section
}

// Menu data definition
const menuData: MenuSectionData[] = [
    {
        id: 'desayunos',
        title: 'Desayunos',
        icon: 'fas fa-coffee',
        items: [
            { title: 'Chilaquiles', description: 'Rojos o verdes, acompañados de frijoles, queso, crema y cebolla', price: '$130.00' },
            { title: 'Huevos al gusto', description: 'Mexicana, Revueltos, Con jamón, Estrellados, Omelette con salchicha o jamón', price: '$120.00' },
            { title: 'Hot-cakes', description: '3 piezas con mantequilla, miel de maple y tocino', price: '$115.00' },
            { title: 'Plato de fruta', description: 'Papaya, melón, fresas, con miel de abeja y granola; elegir: queso cottage o yogurt natural', price: '$120.00' },
            { title: 'Molletes salados', description: '2 molletes: frijol con queso, frijol con queso y chorizo', price: '$90.00' },
            { title: 'Molletes Dulces', description: '2 molletes: sencillo o combinado con cajeta, mermelada de fresa, lechera, Nutella, azúcar y canela, miel', price: '$95.00' },
        ],
    },
    {
        id: 'entradas',
        title: 'Entradas',
        icon: 'fas fa-utensils',
        items: [
            { title: 'Guacamole con picaña', description: 'Guacamole tradicional con puntas de picaña al carbón', price: '$250.00' },
            { title: 'Panela asada', description: 'Panela asada al carbón marinada con chimichurri', price: '$120.00' },
            { title: 'Chistorra asada', description: 'Porción de chistorra asada al carbón marinada con chimichurri', price: '$130.00' },
            { title: 'Tiradito de atún', description: 'Láminas de atún sobre ruedas de pepino, chile serrano y salsa sweet ponzu', price: '$230.00' },
            { title: 'Cecina', description: '150g horneada con guacamole tradicional', price: '$240.00' },
            { title: 'Tostadas de atún', description: '1 tostada de atún marinado en salsa negra con flor de aguacate', price: '$120.00' },
            { title: 'Sopa Azteca', description: 'Sopa de tortilla con aguacate, queso manchego y crema', price: '$95.00' },
            { title: 'Torre Tajal de atún', description: 'Atún rojo en trozos sobre aguacate', price: '$280.00' },
            { title: 'Queso fundido', description: 'Con chorizo, champiñones o natural', price: '$160.00' },
            { title: 'Papa gratinada con arrachera', description: 'Papa con queso gratinado y fajitas de arrachera', price: '$180.00' },
            { title: 'Papas a la francesa', price: '$80.00' },
            { title: 'Guacamole', description: 'Dip con totopos', price: '$70.00' },
            { title: 'Tuétanos Tajal', description: '3 piezas al grill con esquites y salsa de la casa', price: '$270.00' },
        ],
    },
    {
        id: 'ensaladas',
        title: 'Ensaladas',
        icon: 'fas fa-leaf',
        items: [
            { title: 'Ensalada César', description: 'Mix de lechugas, crotones, queso parmesano, aderezo César y pollo', price: '$180.00' },
            { title: 'Ensalada Premium', description: 'Mix de lechuga, espinaca, queso de cabra, nuez garapiñada y pollo con aderezo de miel mostaza', price: '$200.00' },
            { title: 'Ensalada Tajal', description: 'Mix de lechuga con pollo, espinaca, arándano, panela, fresa, frutos rojos y vinagreta', price: '$200.00' },
            { title: 'Ensalada Texmex', description: 'Mix de lechuga, jitomate, elote, aguacate, cebolla morada, chips y arrachera con aderezo de chipotle', price: '$200.00' },
        ],
    },
    {
        id: 'pastas',
        title: 'Pastas',
        icon: 'fas fa-utensil-spoon',
        items: [
            { title: 'Alfredo', description: 'Pasta con crema Alfredo, mantequilla y queso parmesano', price: '$135.00' },
            { title: 'Amatriciana', description: 'Pasta en salsa amatriciana, guanciale y queso', price: '$150.00' },
            { title: 'Alfredo con camarón', description: 'Pasta Alfredo con camarón al vino blanco y queso parmesano', price: '$190.00' },
            { title: 'Especial del chef', description: 'Pasta fusilli con salsa casera estilo italiano', price: '$160.00' },
            { title: 'Especial Tajal', description: 'Pasta fusilli salteada con mantequilla y vegetales al dente', price: '$145.00' },
        ],
    },
    {
        id: 'hamburguesas',
        title: 'Hamburguesas',
        icon: 'fas fa-hamburger',
        items: [
            { title: 'Hamburguesa tradicional', description: 'Carne de res, queso Americano y tocino', price: '$175.00' },
            { title: 'La Consentida Tajal', description: 'Rib eye 200g, receta especial', price: '$220.00' },
            { title: 'Hamburguesa de camarón', description: 'Camarones a la plancha con queso manchego', price: '$215.00' },
            { title: 'Hamburguesa de pollo', description: 'Pechuga de pollo y queso americano', price: '$175.00' },
        ],
        note: 'Todas incluyen 150g de papas, jitomate, cebolla y lechuga',
    },
    {
        id: 'cortes',
        title: 'Cortes',
        icon: 'fas fa-drumstick-bite',
        items: [
            { title: 'Arrachera 350g', description: 'Con frijoles y guacamole', price: '$330.00' },
            { title: 'Rib-eye 350g', description: 'Con papa al gratin y ensalada', price: '$370.00' },
            { title: 'Picaña 350g', description: 'Con frijoles y guacamole', price: '$300.00' },
            { title: 'T-bone 350g', description: 'Con champiñones al ajillo y elote amarillo', price: '$370.00' },
            { title: 'Cowboy 400g', description: 'Con ensalada fresca y papítas al limon', price: '$470.00' },
            { title: 'Tomahawk (1kg–1.2kg)', description: 'Con una ensalada especial de la casa', price: '$1,200.00' },
        ],
    },
    {
        id: 'del-mar',
        title: 'Del Mar',
        icon: 'fas fa-fish',
        items: [
            { title: 'Aguachile negro de camarón (150g)', price: '$205.00' },
            { title: 'Aguachile rojo de camarón (150g)', price: '$205.00' },
            { title: 'Tacos gobernador', description: '3 tacos de camarón gratinados con aguacate', price: '$250.00' },
            { title: 'Salmón a las brasas', description: 'Medallón de salmón con vegetales salteados', price: '$255.00' },
            { title: 'Atún sellado', description: 'Con costra de ajonjolí y ensalada fresca', price: '$245.00' },
            { title: 'Camarones al gusto', description: 'Con arroz y ensalada: a la mantequilla, a la diabla, al mojo de ajo', price: '$250.00' },
            { title: 'Pulpo estilo Tajal', description: 'Pulpo a las brasas con puré de papa y ensalada', price: '$420.00' },
            { title: 'Especial Tajal', description: 'Camarones empanizados de la casa', price: '$230.00' },
        ],
    },
    {
        id: 'infantil',
        title: 'Menú Infantil',
        icon: 'fas fa-child',
        items: [
            { title: 'Nuggets de pollo', description: 'Con papas a la francesa', price: '$130.00' },
            { title: 'Hot dogs', description: '1 pieza con papas a la francesa', price: '$80.00' },
            { title: 'Hamburguesa infantil', description: 'Con papas a la francesa', price: '$150.00' },
            { title: 'Sopa de fideo con tocino', price: '$90.00' },
        ],
    },
    {
        id: 'extras',
        title: 'Extras',
        icon: 'fas fa-plus',
        items: [
            { title: 'Arrachera 150g', price: '$80.00' },
            { title: 'Pollo 150g', price: '$50.00' },
            { title: 'Camarón 100g', price: '$80.00' },
            { title: 'Guacamole 150g', price: '$50.00' },
            { title: 'Frijoles 150g', price: '$40.00' },
            { title: 'Elotes (3 rebanadas)', price: '$50.00' },
            { title: 'Panela 150g', price: '$50.00' },
        ],
    },
    {
        id: 'postres',
        title: 'Postres',
        icon: 'fas fa-ice-cream',
        items: [
            { title: 'Tarta de chocolate', price: '$135.00' },
            { title: 'Chesscake de fresa', price: '$135.00' },
            { title: 'Pastel blueberry', price: '$135.00' },
            { title: 'Crees cake de sarzamora', price: '$135.00' },
        ],
    },
    {
        id: 'bebidas',
        title: 'Bebidas',
        icon: 'fas fa-glass-martini-alt',
        headerBgColor: 'var(--color-secondary)', // Specific background for this section header
        subsections: [
            {
                title: 'Coctelería',
                items: [
                    { title: 'Apperol Spritz', price: '$150.00' },
                    { title: 'Bloody Mary', price: '$95.00' },
                    { title: 'Canija', price: '$120.00' },
                    { title: 'Carajillo', price: '$150.00' },
                    { title: 'Clericot', price: '$150.00' },
                    { title: 'Hierbabuena', price: '$95.00' },
                    { title: 'Margarita', price: '$95.00' },
                    { title: 'Michelada clara', price: '$90.00' },
                    { title: 'Michelada obscura', price: '$100.00' },
                    { title: 'Michelada con Camarón', price: '$130.00' },
                    { title: 'Mimosa', price: '$100.00' },
                    { title: 'Mojito', price: '$85.00' },
                    { title: 'Piña Colada', price: '$80.00' },
                    { title: 'Perla Negra', price: '$165.00' },
                    { title: 'Ruso Blanco', price: '$100.00' },
                    { title: 'Sangría', price: '$100.00' },
                ],
            },
            {
                title: 'Cervezas',
                subSubsections: [
                    {
                        title: 'Normales',
                        items: [
                            { title: 'Corona', price: '$45.00' },
                            { title: 'Corona Light', price: '$45.00' },
                            { title: 'Modelo Especial', price: '$55.00' },
                            { title: 'Negra Modelo', price: '$55.00' },
                            { title: 'Pacifico', price: '$45.00' },
                            { title: 'Ultra', price: '$55.00' },
                            { title: 'Victoria', price: '$45.00' },
                        ],
                    },
                    {
                        title: 'Artesanales',
                        items: [
                            { title: 'Colimitas', price: '$95.00' },
                            { title: 'Colimita Lager', price: '$95.00' },
                            { title: 'Paromo', price: '$95.00' },
                            { title: 'Piedra Lisa', price: '$95.00' },
                            { title: 'Ticus', price: '$95.00' },
                        ],
                    },
                ],
            },
            {
                title: 'Licores',
                subSubsections: [
                    {
                        title: 'Tequila',
                        items: [
                            { title: '30-30 Blanco', description: 'Copeo / Botella', price: '$75.00 / $980.00' },
                            { title: '30-30 Cristalino', description: 'Copeo / Botella', price: '$120.00 / $1,575.00' },
                            { title: '30-30 Reposado', description: 'Copeo / Botella', price: '$75.00 / $900.00' },
                            { title: '1800 Blanco', description: 'Copeo / Botella', price: '$125.00 / $1,445.00' },
                            { title: '1800 Cristalino', description: 'Copeo / Botella', price: '$130.00 / $1,655.00' },
                            { title: '1800 Reposado', description: 'Copeo / Botella', price: '$130.00 / $1,500.00' },
                            { title: '7 Leguas Blanco', description: 'Copeo / Botella', price: '$130.00 / $1,450.00' },
                            { title: '7 Leguas Reposado', description: 'Copeo / Botella', price: '$125.00 / $1,400.00' },
                            { title: 'Antiguo Plata', description: 'Copeo / Botella', price: '$110.00 / $1,200.00' },
                            { title: 'Cascahuin Blanco', description: 'Copeo / Botella', price: '$130.00 / $1,650.00' },
                            { title: 'Centenario Plata', description: 'Copeo / Botella', price: '$75.00 / $1,000.00' },
                            { title: 'Centenario Reposado', description: 'Copeo / Botella', price: '$75.00 / $1,000.00' },
                            { title: 'Dobel Diamante', description: 'Copeo / Botella', price: '$145.00 / $1,885.00' },
                            { title: 'Don Julio 70', description: 'Copeo / Botella', price: '$200.00 / $2,150.00' },
                            { title: 'Don Julio Blanco', description: 'Copeo / Botella', price: '$130.00 / $1,650.00' },
                            { title: 'Don Julio Reposado', description: 'Copeo / Botella', price: '$165.00 / $1,935.00' },
                            { title: 'Herradura Blanco', description: 'Copeo / Botella', price: '$115.00 / $1,300.00' },
                            { title: 'Herradura Plata', description: 'Copeo / Botella', price: '$130.00 / $1,600.00' },
                            { title: 'Herradura Reposado', description: 'Copeo / Botella', price: '$115.00 / $1,300.00' },
                            { title: 'Herradura Ultra', description: 'Copeo / Botella', price: '$150.00 / $1,850.00' },
                            { title: 'San Matias Cristalino', description: 'Copeo / Botella', price: '$200.00 / $2,100.00' },
                            { title: 'Tradicional Plata', description: 'Copeo / Botella', price: '$85.00 / $955.00' },
                            { title: 'Tradicional Reposado', description: 'Copeo / Botella', price: '$85.00 / $955.00' },
                        ],
                    },
                    {
                        title: 'Cognac',
                        items: [
                            { title: 'Martell V.S.O.P.', description: 'Copeo / Botella', price: '$220.00 / $2,650.00' },
                            { title: 'Hennessy V.S.O.P.', description: 'Copeo / Botella', price: '$265.00 / $3,200.00' },
                        ],
                    },
                    {
                        title: 'Brandy',
                        items: [
                            { title: 'Torres 10', description: 'Copeo / Botella', price: '$70.00 / $845.00' },
                            { title: 'Alta Luz', description: 'Copeo / Botella', price: '$125.00 / $1,500.00' },
                        ],
                    },
                    {
                        title: 'Ron',
                        items: [
                            { title: 'Bacardi 8', description: 'Copeo / Botella', price: '$210.00 / $2,200.00' },
                            { title: 'Bacardi Añejo', description: 'Copeo / Botella', price: '$60.00 / $800.00' },
                            { title: 'Bacardi Blanco', description: 'Copeo / Botella', price: '$60.00 / $800.00' },
                            { title: 'Bacardi Mango', description: 'Copeo / Botella', price: '$50.00 / $700.00' },
                            { title: 'Flor de Caña 12', description: 'Copeo / Botella', price: '$190.00 / $1,650.00' },
                            { title: 'Habana 7', description: 'Copeo / Botella', price: '$100.00 / $1,350.00' },
                            { title: 'Malibu', description: 'Copeo / Botella', price: '$65.00 / $850.00' },
                            { title: 'Zacapa 23', description: 'Copeo / Botella', price: '$210.00 / $2,650.00' },
                        ],
                    },
                    {
                        title: 'Whisky',
                        items: [
                            { title: 'Black Label', description: 'Copeo / Botella', price: '$220.00 / $2,255.00' },
                            { title: 'Buchanas 12', description: 'Copeo / Botella', price: '$225.00 / $2,400.00' },
                            { title: 'Buchanas Two Souls', description: 'Copeo / Botella', price: '$225.00 / $2,450.00' },
                            { title: 'Chivas 12', description: 'Copeo / Botella', price: '$210.00 / $2,150.00' },
                            { title: 'Old Par', description: 'Copeo / Botella', price: '$200.00 / $2,100.00' },
                            { title: 'Red Label', description: 'Copeo / Botella', price: '$95.00 / $1,250.00' },
                        ],
                    },
                    {
                        title: 'Vodka',
                        items: [
                            { title: 'Absolut Azul', description: 'Copeo / Botella', price: '$65.00 / $1,000.00' },
                            { title: 'Absolut Citron', description: 'Copeo / Botella', price: '$65.00 / $1,000.00' },
                            { title: 'Absolut Mandarina', description: 'Copeo / Botella', price: '$65.00 / $1,000.00' },
                            { title: 'Absolut Rasberri', description: 'Copeo / Botella', price: '$65.00 / $1,000.00' },
                            { title: 'Grey Goose', description: 'Copeo / Botella', price: '$145.00 / $1,950.00' },
                        ],
                    },
                    {
                        title: 'Ginebra',
                        items: [
                            { title: 'Beefeater', description: 'Copeo / Botella', price: '$120.00 / $1,500.00' },
                            { title: 'Bombay', description: 'Copeo / Botella', price: '$110.00 / $1,550.00' },
                            { title: 'Hendricks', description: 'Copeo / Botella', price: '$200.00 / $2,000.00' },
                            { title: 'London N.1', description: 'Copeo / Botella', price: '$215.00 / $2,400.00' },
                            { title: 'Tanqueray', description: 'Copeo / Botella', price: '$130.00 / $1,750.00' },
                        ],
                    },
                    {
                        title: 'Mezcal',
                        items: [
                            { title: '400 Conejos (Joven)', description: 'Copeo / Botella', price: '$115.00 / $1,400.00' },
                            { title: 'Agua Maldita', description: 'Copeo / Botella', price: '$115.00 / $1,450.00' },
                            { title: 'Apaluz', description: 'Copeo / Botella', price: '$115.00 / $1,555.00' },
                            { title: 'Monte Lobos Joven', description: 'Copeo / Botella', price: '$185.00 / $1,955.00' },
                        ],
                    },
                    {
                        title: 'Licores', // Using 'Licores' as sub-category title as in menu
                        items: [
                            { title: 'Baileys', price: '$90.00' },
                            { title: 'Chambord', price: '$135.00' },
                            { title: 'Frangelico', price: '$95.00' },
                            { title: 'Hipnotic', description: 'Copeo / Botella', price: '$140.00 / $1,750.00' },
                            { title: 'Jagermeister', description: 'Copeo / Botella', price: '$100.00 / $1,500.00' },
                            { title: 'Kahlúa', price: '$55.00' },
                            { title: 'Licor 43', price: '$100.00' },
                            { title: 'Vacari Blanco', price: '$85.00' },
                            { title: 'Vacari Negro', price: '$85.00' },
                        ],
                    },
                ],
            },
            {
                title: 'Vinos',
                subSubsections: [
                    {
                        title: 'Tintos',
                        items: [
                            { title: '31.8', description: 'Copeo / Botella', price: '$180.00 / $900.00' },
                            { title: '3V', description: 'Botella', price: '$1,350.00' },
                            { title: 'Casa Madero Gran Reserva', description: 'Copeo / Botella', price: '$230.00 / $1,450.00' },
                            { title: 'Portillo', description: 'Copeo / Botella', price: '$120.00 / $1,450.00' },
                        ],
                    },
                    {
                        title: 'Blancos',
                        items: [
                            { title: '31.8', description: 'Copeo / Botella', price: '$150.00 / $1,000.00' },
                            { title: '2V', description: 'Botella', price: '$1,200.00' },
                        ],
                    },
                ],
            },
            {
                title: 'Bebidas sin Alcohol',
                items: [
                    { title: 'Agua Mineral Hethe', price: '$90.00' },
                    { title: 'Botella de Agua', price: '$30.00' },
                    { title: 'Café Americano', price: '$95.00' },
                    { title: 'Café Capuchino', price: '$65.00' },
                    { title: 'Café Expresso', price: '$95.00' },
                    { title: 'Chocomilk', price: '$45.00' },
                    { title: 'Jugo de Naranja', price: '$45.00' },
                    { title: 'Limonada de frutos rojos', price: '$75.00' },
                    { title: 'Limonada', price: '$75.00' },
                    { title: 'Limonada 1L', price: '$140.00' },
                    { title: 'Jarra de limpnada', price: '$190.00' },
                    { title: 'Naranjada', price: '$75.00' },
                    { title: 'Naranjada 1L', price: '$140.00' },
                    { title: 'Jarra de Naranjada', price: '$190.00' },
                    { title: 'Naranjada de Maracuyá', price: '$80.00' },
                    { title: 'Piñada', price: '$90.00' },
                    { title: 'Soda Italiana', price: '$90.00' },
                    { title: 'Red Bull', price: '$100.00' },
                    { title: 'Refresco 355ml', description: 'coca, squirt, agua mineral', price: '$45.00' },
                ],
            },
            {
                title: 'Energizantes',
                items: [
                    { title: 'Boost (235ml)', price: '$75.00' },
                    { title: 'Red Bull', price: '$100.00' },
                ],
            },
            {
                title: 'Tisanas',
                items: [
                    { title: 'Cítrica', price: '$65.00' },
                    { title: 'Frutos Rojos', price: '$75.00' },
                ],
            },
        ],
    },
];

const RestaurantMenu: React.FC = () => {
    const [activeSection, setActiveSection] = useState<string>('');
    const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            let currentActive = '';
            // Adjust offset to account for sticky nav height and a small buffer
            const scrollPosition = window.scrollY + (navRef.current?.offsetHeight || 0) + 10;

            for (const section of menuData) {
                const element = sectionRefs.current[section.id];
                if (element && scrollPosition >= element.offsetTop && scrollPosition < element.offsetTop + element.offsetHeight) {
                    currentActive = section.id;
                    break;
                }
            }
            setActiveSection(currentActive);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Set active section on initial load
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = sectionRefs.current[id];
        if (element) {
            const offset = navRef.current?.offsetHeight || 0;
            window.scrollTo({
                top: element.offsetTop - offset - 10, // Adjust scroll position for sticky nav
                behavior: 'smooth',
            });
        }
    };

    return (
        <html lang="es">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Restaurante & Mixología TAJAL - Carta Digital</title>
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Raleway:wght@300;400;500;600&display=swap" rel="stylesheet" />
                <style>
                    {`
                    :root {
                        --color-primary: #382618;
                        --color-secondary: #8B4513;
                        --color-accent: #d4af37;
                        --color-light: #f8f5f0;
                        --color-dark: #1a1a1a;
                    }

                    body {
                        font-family: 'Raleway', sans-serif;
                        background-color: var(--color-light);
                        color: var(--color-dark);
                        line-height: 1.6;
                    }

                    h1, h2, h3, h4 {
                        font-family: 'Playfair Display', serif;
                        font-weight: 700;
                    }

                    .menu-section {
                        margin-bottom: 2rem;
                        border-radius: 8px;
                        overflow: hidden;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                        background-color: white;
                    }

                    .menu-section-header {
                        background-color: var(--color-primary);
                        color: white;
                        padding: 1rem 1.5rem;
                        position: relative;
                        overflow: hidden;
                    }

                    .menu-section-header::after {
                        content: '';
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        width: 100%;
                        height: 2px;
                        background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
                    }

                    .menu-item {
                        border-bottom: 1px solid #eee;
                        transition: all 0.3s ease;
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                    }

                    .menu-item:last-child {
                        border-bottom: none;
                    }

                    .menu-item:hover {
                        background-color: rgba(212, 175, 55, 0.05);
                    }

                    .menu-item-content {
                        flex: 1;
                    }

                    .menu-item-title {
                        font-weight: 600;
                        color: var(--color-secondary);
                    }

                    .menu-item-description {
                        font-size: 0.9rem;
                        color: #666;
                        font-style: italic;
                    }

                    .menu-item-price {
                        font-weight: 600;
                        color: var(--color-primary);
                        min-width: 80px;
                        text-align: right;
                        font-size: 1.1rem;
                    }

                    .restaurant-header {
                        background: linear-gradient(to right, rgba(26, 26, 26, 0.9), rgba(26, 26, 26, 0.7)), url('https://factoryfy.es/wp-content/uploads/S-2_jpg.jpg');
                        background-size: cover;
                        background-position: center;
                        color: white;
                        position: relative;
                    }

                    .nav-link {
                        position: relative;
                        transition: all 0.3s ease;
                        cursor: pointer;
                    }

                    .nav-link::after {
                        content: '';
                        position: absolute;
                        width: 0;
                        height: 2px;
                        bottom: -2px;
                        left: 0;
                        background-color: var(--color-accent);
                        transition: width 0.3s ease;
                    }

                    .nav-link:hover::after {
                        width: 100%;
                    }

                    .nav-link.active::after {
                        width: 100%;
                    }

                    .nav-link.active {
                        color: var(--color-accent);
                    }

                    .restaurant-logo {
                        font-size: 2.5rem;
                        font-weight: bold;
                        color: white;
                        position: relative;
                        display: inline-block;
                    }

                    .restaurant-logo::after {
                        content: '';
                        position: absolute;
                        width: 40px;
                        height: 3px;
                        background-color: var(--color-accent);
                        bottom: -5px;
                        left: 0;
                    }

                    .golden-detail {
                        color: var(--color-accent);
                    }

                    .category-nav {
                        overflow-x: auto;
                        white-space: nowrap;
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                        background-color: var(--color-dark);
                    }

                    .category-nav::-webkit-scrollbar {
                        display: none;
                    }

                    @media (max-width: 768px) {
                        .menu-item {
                            padding: 1rem !important;
                        }
                    }

                    .footer {
                        background-color: var(--color-dark);
                        color: white;
                    }

                    .beverage-section {
                        background-color: var(--color-dark);
                        color: white;
                    }

                    .icon-circle {
                        background-color: var(--color-accent);
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 1rem;
                        color: var(--color-dark);
                    }

                    .section-divider {
                        height: 2px;
                        background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
                        margin: 2rem 0;
                    }

                    button:focus {
                        outline: none;
                    }

                    .price-badge {
                        background-color: var(--color-accent);
                        color: var(--color-dark);
                        padding: 3px 8px;
                        border-radius: 4px;
                        font-weight: bold;
                        font-size: 0.9rem;
                    }
                    `}
                </style>
            </head>
            <body>
                {/* Header */}
                <header className="restaurant-header py-16 px-4">
                    <div className="container mx-auto text-center">
                        <h1 className="restaurant-logo mb-4">TAJAL</h1>
                        <p className="text-xl mb-6">RESTAURANTE & MIXOLOGÍA</p>
                        <p className="italic text-gray-300">Sabores mexicanos con un toque de elegancia</p>
                    </div>
                </header>

                {/* Navigation */}
                <nav ref={navRef} className="category-nav sticky top-0 z-50 py-3 px-4 shadow-md">
                    <div className="container mx-auto flex justify-start items-center space-x-6">
                        {menuData.map((section) => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection(section.id);
                                }}
                                className={`nav-link text-white px-2 py-1 ${activeSection === section.id ? 'active' : ''}`}
                            >
                                {section.title}
                            </a>
                        ))}
                    </div>
                </nav>

                <div className="container mx-auto py-8 px-4">
                    {/* Introduction */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl mb-4">Nuestra Carta</h2>
                        <div className="w-24 h-1 bg-yellow-700 mx-auto mb-6"></div>
                        <p className="max-w-xl mx-auto text-gray-600">
                            Disfruta de nuestra selección de platillos preparados con los mejores ingredientes y técnicas culinarias, fusionando sabores tradicionales con toques contemporáneos.
                        </p>
                    </div>

                    {/* Dynamic Menu Sections */}
                    {menuData.map((section) => (
                        <section
                            id={section.id}
                            key={section.id}
                            ref={(el) => (sectionRefs.current[section.id] = el)}
                            className={`menu-section mb-12 ${section.id === 'bebidas' ? 'beverage-section' : ''}`}
                        >
                            <div
                                className="menu-section-header"
                                style={section.headerBgColor ? { backgroundColor: section.headerBgColor } : {}}
                            >
                                <h2 className="text-2xl flex items-center">
                                    <span className="icon-circle">
                                        <i className={section.icon}></i>
                                    </span>
                                    {section.title}
                                </h2>
                            </div>
                            <div className="p-6">
                                {section.items && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {section.items.map((item, itemIndex) => (
                                            <div key={itemIndex} className="menu-item p-4">
                                                <div className="menu-item-content">
                                                    <h3 className={`menu-item-title text-xl mb-2 ${section.id === 'bebidas' ? 'text-white' : ''}`}>
                                                        {item.title}
                                                    </h3>
                                                    {item.description && (
                                                        <p className={`menu-item-description mb-2 ${section.id === 'bebidas' ? 'text-gray-400' : ''}`}>
                                                            {item.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <p className={`menu-item-price ${section.id === 'bebidas' ? 'text-yellow-400' : ''}`}>
                                                    {item.price}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {section.note && (
                                    <p className="text-sm italic mt-4 text-gray-600">{section.note}</p>
                                )}

                                {section.subsections && section.subsections.map((subsection, subIndex) => (
                                    <div key={subIndex} className="mb-8">
                                        <h3 className="text-xl mb-4 text-yellow-400 font-bold">{subsection.title}</h3>
                                        {subsection.items && (
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                                {subsection.items.map((item, itemIndex) => (
                                                    <div key={itemIndex} className="menu-item p-4 border-b border-gray-700">
                                                        <div className="menu-item-content">
                                                            <h3 className="menu-item-title text-white mb-2">{item.title}</h3>
                                                            {item.description && <p className="text-gray-400">{item.description}</p>}
                                                        </div>
                                                        <p className="menu-item-price text-yellow-400">{item.price}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {subsection.subSubsections && subsection.subSubsections.map((subSub, subSubIndex) => (
                                            <div key={subSubIndex} className="mb-8">
                                                <h4 className="text-lg mb-4 text-yellow-300 font-semibold">{subSub.title}</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                                    {subSub.items.map((item, itemIndex) => (
                                                        <div key={itemIndex} className="menu-item p-4 border-b border-gray-700">
                                                            <div className="menu-item-content">
                                                                <h3 className="menu-item-title text-white mb-2">{item.title}</h3>
                                                                {item.description && <p className="text-gray-400">{item.description}</p>}
                                                            </div>
                                                            <p className="menu-item-price text-yellow-400">{item.price}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                        {subIndex < section.subsections.length - 1 && <div className="section-divider"></div>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Footer */}
                <footer className="footer py-8 px-4">
                    <div className="container mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="mb-6 md:mb-0">
                                <h2 className="text-2xl font-bold mb-2">Restaurante & Mixología TAJAL</h2>
                                <p className="text-gray-400">La mejor experiencia gastronómica</p>
                            </div>
                            <div>
                                <p className="text-center md:text-right text-gray-400">
                                    <i className="fas fa-map-marker-alt mr-2"></i> Av. México 123, Col. Centro<br />
                                    <i className="fas fa-phone-alt mr-2"></i> (123) 456-7890<br />
                                    <i className="fas fa-envelope mr-2"></i> info@tajal.com
                                </p>
                            </div>
                        </div>
                        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                            <p className="text-gray-500 text-sm">
                                © 2024 Restaurante TAJAL. Todos los derechos reservados.
                                <a href="#" className="text-yellow-500 hover:text-yellow-400 ml-2">Política de privacidad</a>
                            </p>
                        </div>
                    </div>
                </footer>
            </body>
        </html>
    );

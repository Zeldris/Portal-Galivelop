// Textos de la interfaz. El castellano es la referencia: gallego e inglés deben tener las mismas
// claves (lo comprueba src/data/proyectos.test.ts). Los textos de cada proyecto van en su .json.

const es = {
  'nav.proyectos': 'Proyectos',
  'nav.sobre': 'Galivelop',
  'nav.contacto': 'Contacto',
  'nav.saltar': 'Saltar al contenido',
  'nav.menu': 'Menú',

  'hero.antetitulo': 'Galicia + Develop',
  'hero.titulo1': 'Software con',
  'hero.titulo2': 'raíces gallegas',
  'hero.texto':
    'Galivelop es la marca que reúne todos nuestros desarrollos: de un juego de rol con inteligencia artificial a una plataforma de verificación de noticias. Aquí está lo que ya funciona y lo que se está construyendo.',
  'hero.cta.proyectos': 'Ver proyectos',
  'hero.cta.sobre': 'Qué es Galivelop',
  'hero.resumen.proyectos': 'proyectos',
  'hero.resumen.publicados': 'publicados',
  'hero.resumen.desarrollo': 'en desarrollo',

  'proyectos.titulo': 'Proyectos',
  'proyectos.texto': 'Productos terminados y en marcha, cada uno con su estado real.',
  'filtro.todos': 'Todos',
  'filtro.vacio': 'No hay proyectos con este estado todavía.',
  'estado.publicado': 'Publicado',
  'estado.desarrollo': 'En desarrollo',
  'estado.diseno': 'En diseño',
  'tarjeta.ver': 'Ver proyecto',

  'proyecto.volver': 'Todos los proyectos',
  'proyecto.avance': 'Avance',
  'proyecto.actualizado': 'Ficha actualizada el',
  'proyecto.sinEnlace': 'Aún sin versión pública',
  'proyecto.expandir': 'Abrir todo',
  'proyecto.contraer': 'Cerrar todo',

  'sec.galeria': 'Galería',
  'sec.descripcion': 'Descripción',
  'sec.caracteristicas': 'Características clave',
  'sec.ficha': 'Ficha técnica',
  'sec.hitos': 'Estado y hoja de ruta',
  'sec.novedades': 'Novedades',
  'sec.decisiones': 'Decisiones de diseño',
  'sec.equipo': 'Equipo',

  'hito.hecho': 'Hecho',
  'hito.curso': 'En curso',
  'hito.pendiente': 'Pendiente',

  'galeria.anterior': 'Imagen anterior',
  'galeria.siguiente': 'Imagen siguiente',
  'galeria.ampliar': 'Ampliar imagen',
  'galeria.cerrar': 'Cerrar',
  'galeria.posicion': 'Imagen {n} de {total}',

  'sobre.titulo': 'Qué es Galivelop',
  'sobre.texto1':
    'Galivelop nace de unir dos palabras: Galicia y Develop. Es la marca bajo la que se publican todos nuestros desarrollos, propios o en colaboración, y la manera de mostrarlos juntos en un solo sitio.',
  'sobre.texto2':
    'Nos interesa el producto completo: la idea, el diseño, el código, la puesta en marcha y lo que viene después. Por eso aquí no solo hay proyectos terminados; también enseñamos los que están a medio camino, con su hoja de ruta real.',
  'valor1.titulo': 'De principio a fin',
  'valor1.texto': 'Del primer boceto al producto publicado, con interfaz, servidor, datos y despliegue.',
  'valor2.titulo': 'IA con criterio',
  'valor2.texto': 'Inteligencia artificial donde aporta, y en local siempre que se pueda: privacidad y costes bajo control.',
  'valor3.titulo': 'Trabajo a la vista',
  'valor3.texto': 'Cada proyecto muestra su estado y sus próximos pasos, no solo el resultado final.',

  'contacto.titulo': '¿Hablamos?',
  'contacto.texto':
    '¿Te interesa alguno de los proyectos, quieres colaborar o tienes una idea? Escríbenos y te respondemos.',
  'contacto.github': 'Galivelop en GitHub',
  'contacto.correo': 'Escríbenos',
  'contacto.porProyecto': 'Contacto de cada proyecto',
  'proyecto.contactar': 'Contactar',

  'pie.hecho': 'Hecho en Galicia',
  'pie.derechos': 'Todos los derechos reservados.',

  'tema.claro': 'Cambiar a tema claro',
  'tema.oscuro': 'Cambiar a tema oscuro',
  'idioma.etiqueta': 'Idioma',

  'error.titulo': 'Página no encontrada',
  'error.texto': 'Esta página no existe o el proyecto ha cambiado de dirección.',
  'error.volver': 'Volver al inicio',
};

export type Clave = keyof typeof es;

const gl: Record<Clave, string> = {
  'nav.proyectos': 'Proxectos',
  'nav.sobre': 'Galivelop',
  'nav.contacto': 'Contacto',
  'nav.saltar': 'Saltar ao contido',
  'nav.menu': 'Menú',

  'hero.antetitulo': 'Galicia + Develop',
  'hero.titulo1': 'Software con',
  'hero.titulo2': 'raíces galegas',
  'hero.texto':
    'Galivelop é a marca que reúne todos os nosos desenvolvementos: dun xogo de rol con intelixencia artificial a unha plataforma de verificación de novas. Aquí está o que xa funciona e o que se está a construír.',
  'hero.cta.proyectos': 'Ver proxectos',
  'hero.cta.sobre': 'Que é Galivelop',
  'hero.resumen.proyectos': 'proxectos',
  'hero.resumen.publicados': 'publicados',
  'hero.resumen.desarrollo': 'en desenvolvemento',

  'proyectos.titulo': 'Proxectos',
  'proyectos.texto': 'Produtos rematados e en marcha, cada un co seu estado real.',
  'filtro.todos': 'Todos',
  'filtro.vacio': 'Aínda non hai proxectos con este estado.',
  'estado.publicado': 'Publicado',
  'estado.desarrollo': 'En desenvolvemento',
  'estado.diseno': 'En deseño',
  'tarjeta.ver': 'Ver proxecto',

  'proyecto.volver': 'Todos os proxectos',
  'proyecto.avance': 'Avance',
  'proyecto.actualizado': 'Ficha actualizada o',
  'proyecto.sinEnlace': 'Aínda sen versión pública',
  'proyecto.expandir': 'Abrir todo',
  'proyecto.contraer': 'Pechar todo',

  'sec.galeria': 'Galería',
  'sec.descripcion': 'Descrición',
  'sec.caracteristicas': 'Características clave',
  'sec.ficha': 'Ficha técnica',
  'sec.hitos': 'Estado e folla de ruta',
  'sec.novedades': 'Novidades',
  'sec.decisiones': 'Decisións de deseño',
  'sec.equipo': 'Equipo',

  'hito.hecho': 'Feito',
  'hito.curso': 'En curso',
  'hito.pendiente': 'Pendente',

  'galeria.anterior': 'Imaxe anterior',
  'galeria.siguiente': 'Imaxe seguinte',
  'galeria.ampliar': 'Ampliar imaxe',
  'galeria.cerrar': 'Pechar',
  'galeria.posicion': 'Imaxe {n} de {total}',

  'sobre.titulo': 'Que é Galivelop',
  'sobre.texto1':
    'Galivelop nace de xuntar dúas palabras: Galicia e Develop. É a marca baixo a que se publican todos os nosos desenvolvementos, propios ou en colaboración, e a maneira de amosalos xuntos nun só sitio.',
  'sobre.texto2':
    'Interésanos o produto completo: a idea, o deseño, o código, a posta en marcha e o que vén despois. Por iso aquí non só hai proxectos rematados; tamén ensinamos os que están a medio camiño, coa súa folla de ruta real.',
  'valor1.titulo': 'De principio a fin',
  'valor1.texto': 'Do primeiro bosquexo ao produto publicado, con interface, servidor, datos e despregamento.',
  'valor2.titulo': 'IA con criterio',
  'valor2.texto': 'Intelixencia artificial onde achega, e en local sempre que se poida: privacidade e custos baixo control.',
  'valor3.titulo': 'Traballo á vista',
  'valor3.texto': 'Cada proxecto amosa o seu estado e os seus próximos pasos, non só o resultado final.',

  'contacto.titulo': 'Falamos?',
  'contacto.texto':
    'Interésache algún dos proxectos, queres colaborar ou tes unha idea? Escríbenos e respondémosche.',
  'contacto.github': 'Galivelop en GitHub',
  'contacto.correo': 'Escríbenos',
  'contacto.porProyecto': 'Contacto de cada proxecto',
  'proyecto.contactar': 'Contactar',

  'pie.hecho': 'Feito en Galicia',
  'pie.derechos': 'Todos os dereitos reservados.',

  'tema.claro': 'Cambiar ao tema claro',
  'tema.oscuro': 'Cambiar ao tema escuro',
  'idioma.etiqueta': 'Idioma',

  'error.titulo': 'Páxina non atopada',
  'error.texto': 'Esta páxina non existe ou o proxecto cambiou de enderezo.',
  'error.volver': 'Volver ao inicio',
};

const en: Record<Clave, string> = {
  'nav.proyectos': 'Projects',
  'nav.sobre': 'Galivelop',
  'nav.contacto': 'Contact',
  'nav.saltar': 'Skip to content',
  'nav.menu': 'Menu',

  'hero.antetitulo': 'Galicia + Develop',
  'hero.titulo1': 'Software with',
  'hero.titulo2': 'Galician roots',
  'hero.texto':
    'Galivelop is the brand behind all our work: from an AI-driven role-playing game to a news verification platform. Here you will find what is already live and what is being built.',
  'hero.cta.proyectos': 'See projects',
  'hero.cta.sobre': 'About Galivelop',
  'hero.resumen.proyectos': 'projects',
  'hero.resumen.publicados': 'live',
  'hero.resumen.desarrollo': 'in development',

  'proyectos.titulo': 'Projects',
  'proyectos.texto': 'Finished and ongoing products, each with its real status.',
  'filtro.todos': 'All',
  'filtro.vacio': 'No projects with this status yet.',
  'estado.publicado': 'Live',
  'estado.desarrollo': 'In development',
  'estado.diseno': 'In design',
  'tarjeta.ver': 'View project',

  'proyecto.volver': 'All projects',
  'proyecto.avance': 'Progress',
  'proyecto.actualizado': 'Last updated',
  'proyecto.sinEnlace': 'No public release yet',
  'proyecto.expandir': 'Expand all',
  'proyecto.contraer': 'Collapse all',

  'sec.galeria': 'Gallery',
  'sec.descripcion': 'Overview',
  'sec.caracteristicas': 'Key features',
  'sec.ficha': 'Tech stack',
  'sec.hitos': 'Status and roadmap',
  'sec.novedades': "What's new",
  'sec.decisiones': 'Design decisions',
  'sec.equipo': 'Team',

  'hito.hecho': 'Done',
  'hito.curso': 'In progress',
  'hito.pendiente': 'Planned',

  'galeria.anterior': 'Previous image',
  'galeria.siguiente': 'Next image',
  'galeria.ampliar': 'Enlarge image',
  'galeria.cerrar': 'Close',
  'galeria.posicion': 'Image {n} of {total}',

  'sobre.titulo': 'About Galivelop',
  'sobre.texto1':
    'Galivelop comes from joining two words: Galicia and Develop. It is the brand under which all our work is published, whether our own or in collaboration, and a way to show it all in one place.',
  'sobre.texto2':
    'We care about the whole product: the idea, the design, the code, the launch and what comes after. That is why you will find not only finished projects here, but also those still on their way, with their real roadmap.',
  'valor1.titulo': 'End to end',
  'valor1.texto': 'From the first sketch to the released product: interface, server, data and deployment.',
  'valor2.titulo': 'Thoughtful AI',
  'valor2.texto': 'Artificial intelligence where it adds value, running locally whenever possible: privacy and costs under control.',
  'valor3.titulo': 'Work in the open',
  'valor3.texto': 'Every project shows its status and next steps, not just the final result.',

  'contacto.titulo': "Let's talk",
  'contacto.texto': 'Interested in a project, want to collaborate or have an idea? Get in touch and we will get back to you.',
  'contacto.github': 'Galivelop on GitHub',
  'contacto.correo': 'Email us',
  'contacto.porProyecto': 'Project contacts',
  'proyecto.contactar': 'Contact',

  'pie.hecho': 'Made in Galicia',
  'pie.derechos': 'All rights reserved.',

  'tema.claro': 'Switch to light theme',
  'tema.oscuro': 'Switch to dark theme',
  'idioma.etiqueta': 'Language',

  'error.titulo': 'Page not found',
  'error.texto': 'This page does not exist or the project has moved.',
  'error.volver': 'Back to home',
};

export const textos = { es, gl, en };

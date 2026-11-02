# 0003 · Lo maduro, con el código abierto; Productos ofrece implantación y servicio

- **Fecha:** 2026-11-02
- **Estado:** **aceptada** el 2026-11-02 (decisión de la persona en la conversación); aplicada en la rama de la
  sesión, sin publicar en `main` hasta que la persona vea la vista previa y lo confirme. Sustituye en parte a la
  [0002](0002-marca-taller-y-productos.md).
- **Decide:** Álvaro García Graña (fundador)

## Contexto

La 0002 dejó Productos como «productos de descarga local»: software que se conseguiría por correo, sin precios, y
que la 1.0.0 del flujo se descargaría solo cuando la versión pública anterior hubiera rodado. Desde entonces la
persona ha hecho públicos los repos de Galivelop-workflow, galivelop-image-generator, Tarkor (World-Maker-Fantasy) y
su instalador. Ya no tiene sentido ofrecer como «descarga» algo cuyo código está abierto en GitHub.

## Decisión

1. **Lo que llega a una fase avanzada o estable pasa a tener el repo público.** Lo que aún no está ahí sigue como
   «próximamente» (hoy, voice-generator y developer).
2. **Productos ofrece implantación y servicio, no una compra.** Lo que se ofrece es que Álvaro lo monte y lo adapte
   al proyecto de quien lo pida, con soporte. El objetivo es que los proyectos den prestigio; los proyectos
   privados se hablarán cuando salga la oportunidad.
3. **La sección Productos se mantiene**, por si alguien quiere comprarlo igualmente aunque sea público. Sigue sin
   precios: todo por correo con Álvaro.
4. **Alcance:** todo lo público, Tarkor y su instalador incluidos. **toVeriAI queda fuera** (sigue privado y como
   desarrollo propio).
5. **Colaboración:** todo lo público admite aportaciones (`colaboracion: "abierta"` en su ficha).
6. **Portada:** los proyectos pasan a pesar más que Productos. El taller va primero y Productos va debajo de los
   proyectos; el botón principal del hero lleva al taller.
7. Galivelop-workflow (con la versión publicada, 0.4.3) y Galivelop Image Generator pasan a `disponible` en
   Productos, con implantación y soporte.
8. **Tarkor no es un producto**: es público y abierto a colaborar, pero no tiene tarjeta en Productos.
9. En la cabecera, Productos deja de ser un botón relleno y pasa a ser un enlace tras un separador.

## Consecuencias

- Los textos que decían «software de descarga local» (hero, Productos, descripciones de `index.html` y de las
  páginas estáticas, aviso legal, glosario, `AGENTS.md`) pasan a hablar de código abierto e implantación.
- La tarea semanal mantiene la versión del producto del flujo junto con su ficha (`docs/runbooks/tarea-semanal.md`;
  el bloque nuevo lo pega la persona en la conversación de la tarea).
- Enlazar cada versión del flujo a su release de GitHub necesita un campo nuevo en el código; se apunta como pendiente.

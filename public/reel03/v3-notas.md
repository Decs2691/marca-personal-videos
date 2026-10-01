# Reel 03, versión 3 (HECHA: `Reel03MrBurgerV3`)

## Por qué
Mr Burger corrigió dos datos del video v2:
- Publican **1 vez por semana** (constante) y hacen **historias diarias**. Es falso que "un día sí, otro no / una semana sí, una no".
- En el **celular** su página de pedidos ya muestra el plato grande y el precio pequeño. Solo en computador sobresale el precio.

Por eso se elimina todo el tramo de los "2 frentes" y la pregunta final, que se apoyaba en el dato falso.

## Estructura acordada
1. 0–22.9 s del video editado (`mrburger-edit.mp4`): **igual** que en la v2 (gancho con comida + lo que hacen bien + "la comida es deliciosa").
2. **Voz en off nueva**, a pantalla completa (sin la cara de Dani: su barba cambió), con tres fichas animadas:
   - **01:** calendario de 1 → 2–3 posts por semana ("ya publican cada semana; subir a 2–3 da más alcance").
   - **02:** perfil con la fila de destacadas **Menú / Clientes / Cómo pedir**. En la captura `mrburger-perfil.png` no hay destacadas. **No usar "Horarios":** ya están completos en su bio (dom–jue 6–12 pm, vie y sáb 6 pm–1 am), y el video elogia la "bio completa".
   - **03:** historia con sticker de pregunta + encuesta ("ya hacen historias diarias; aprovéchenlas con preguntas y encuestas").
3. Vuelve la cara de Dani: "Así que recuerden, no les digo qué está mal… les digo qué mejorar" (≈60.7–63.6 s del edit).
4. **CTA nuevo en voz en off** sobre gráfico de cierre: "¿Tú qué le preguntarías a tu restaurante favorito? Respóndeme en comentarios."

## Guion que Dani va a grabar
> Sin embargo, hay tres cosas que los pueden llevar al siguiente nivel. Primero: hoy publican una vez por semana, y eso está bien, pero subir a dos o tres publicaciones por semana les da mucho más alcance. Segundo: historias destacadas, con el menú, lo que dicen sus clientes y cómo pedir, para que esa información no desaparezca en 24 horas. Y tercero: ya hacen historias todos los días, así que aprovéchenlas con preguntas y encuestas, que pongan a sus clientes a hablar con ustedes.
> (pausa 2 s)
> ¿Tú qué le preguntarías a tu restaurante favorito? Respóndeme en comentarios.

## Animación prevista (pantalla completa, sin la cara de Dani)
1. "Sin embargo, hay tres cosas…": fondo negro, "3" grande con "cosas para subir de nivel"; de fondo, oscurecidos, los clips de comida que no se usaron en el gancho.
2. Ficha 01: calendario de 4 semanas con 1 post/semana ("✓ ya lo hacen"); al decir "dos o tres" se encienden 2 casillas más por semana y sube un contador de alcance.
3. Ficha 02: su perfil real (captura); bajo la bio aparecen las destacadas Menú, Clientes y Cómo pedir, cada una al nombrarla; en "24 horas", un reloj que se vacía y las destacadas se guardan con un check.
4. Ficha 03: celular con una historia de su comida; entran un sticker de pregunta y uno de encuesta con votos; en "a hablar con ustedes", burbujas de respuestas. Los textos de los stickers son de ejemplo; confirmarlos con Dani.
5. La cara de Dani: "Así que recuerden…".
6. CTA en negro: la pregunta y el botón "Respóndeme en comentarios".

## Al integrar
- Audio: igualar volumen y ecualización con la voz del video (medir RMS y espectro antes y después). Transcribir con `tools/transcribe.sh` para los tiempos.
- No afirmar nada que Dani no haya verificado (lección de las dos correcciones).
- Seguir la verificación de `.claude/skills/editar-reel/SKILL.md` antes de entregar.

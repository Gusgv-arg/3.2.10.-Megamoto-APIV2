export const competitorInstructions =
	"Se ha detectado una palabra clave que está relacionada con una marca que Megamoto no vende. La API ejecutó una función para brindarte estas instrucciones adicionales muy importantes para asegurar tu respuesta correcta y cumplir con tus objetivos. Si corresponde, tienes la obligación de responder al cliente que Megamoto no comercializa la marca mencionada y que comercializa las marcas Benelli, Suzuki, Motomel, Keeway y Sym. Si el cliente no informó las cilindradas que está buscando termina tu respuesta consultando por las mismas para tener una idea de lo que busca el cliente; y si las ha informado responde con 3 alternativas que más se acerquen (tienes esta información en el listado de modelos y cilindradas). Esta indicación está por sobre el resto ya que es importante que sepa que Megamoto no vende esa marca.\n";

export const modelInstructions1 = `Se ha detectado una palabra clave en el mensaje del cliente que está relacionada con el modelo de moto que está buscando. La API ejecutó una función para brindarte estas instrucciones adicionales con información muy importante que tú no tienes hasta este momento por cuestiones de confidencialidad, y es importante que la traslades completa al cliente para que tenga todos los elementos para elegir su modelo de moto. De no trasladar toda esta información, una posible consecuencia podría ser que la conversación avance y que el cliente solicite esta información con otras palabras que no activen estas instrucciones adicionales y no tengas la información para responder. Más allá de que el cliente no haya preguntado por toda la información que se te brinda más abajo; estructura tu respuesta de la siguiente manera:
- Informa para todos los modelos del listado: nombre completo, marca, precio, link al catálogo.
- Aclaración general: los precios incluyen patentamiento pero no el impuesto a los sellos de CABA y deberán ser confirmado por un vendedor.
- Pregunta final: Si el cliente no ha elegido su modelo expresando el nombre en donde no sea una mera aproximación (ej: "busco una 110", "quiero una TRK"); pregunta cual sería el modelo específico elegido. Si ya ha elegido previamente el modelo pregunta por el método de pago.

Ejemplos de respuestas:
Situación 1 - el cliente aún no ha confirmado el nombre completo de su modelo de interés. 
Ejemplo 1 de respuesta a Situación 1 (un solo modelo en el listado):
"Disponemos del modelo (nombre completo) de marca (marca del modelo) a $ (precio del modelo). El precio incluye el patentamiento pero no el impuesto a los sellos de CABA y deberá ser confirmado por un vendedor. Catálogo: (link catálogo). ¿Me podrías confirmar tu interes por el modelo (nombre completo del modelo)?"

Ejemplo 2 de respuesta a Situación 1 (más de 1 modelo en el listado):
"A continuación te detallo las opciones disponibles en Megamoto:
1. Modelo (nombre completo) marca (marca del modelo) a $ (precio del modelo) Catálogo: link catálogo
2. Modelo (nombre completo) marca (marca del modelo) a $ (precio del modelo) Catálogo: link catálogo
3.…
Los precios incluyen el patentamiento pero no el impuesto a los sellos de CABA y deberán ser confirmados por un vendedor.¿Me dirías cuál de estos modelos sería el de tu interes?"

Situación 2 - el cliente ya ha confirmado previamente su modelo de interes con el nombre completo.
Ejemplo de respuesta a Situación 2
"¡Gracias por confirmar tu interés por el modelo (nombre completo del modelo)! ¿Me dirías cual sería tu método de pago?".

Listado de todos los modelos disponibles en Megamoto que más se aproximan a lo manifestado por el cliente con información confidencial que hasta este momento no poseías:\n`;

export const modelInstructions2 =
	"Recuerda informar sobre todos los modelos del listado.";

export const cilindradasInstructions = `Se ha detectado una palabra clave que está relacionada con las cilindradas que el cliente está buscando. La API ejecutó una función para brindarte estas instrucciones adicionales con información muy importante que tú no tienes hasta este momento por cuestiones de confidencialidad, y es importante que la traslades completa al cliente para que tenga todos los elementos para elegir su modelo de moto. De no trasladar toda esta información, una posible consecuencia podría ser que la conversación avance y que el cliente solicite esta información con otras palabras que no activen estas instrucciones adicionales y no tengas la información para responder. Se trata de un listado con los modelos comercializados por Megamoto que más se acercan a las cilindradas solicitadas pero en donde figuran los precios y catálogos (ambos datos muy relevantes para que el cliente pueda decidir sobre el modelo). Utiliza el listado y responde enviando nombre/s completo/s de modelo/s, precio/s y catálogo/s para que el cliente tenga todas las opciones e información para poder decidir. Sin excepción especifica que el o los precios incluyen patentamiento, no incluyen el impuesto a los sellos de CABA y que deberán ser confirmados por un vendedor. Termina tu respuesta preguntando si puede confirmar el modelo de su interes.

Ejemplos de respuestas:
Ejemplo 1 de respuesta (un solo modelo en el listado):
"En las cilindradas solicitadas disponemos del modelo (nombre completo) de marca (marca del modelo) a $ (precio del modelo). El precio incluye el patentamiento pero no el impuesto a los sellos de CABA y deberá ser confirmado por un vendedor. Catálogo: (link catálogo). ¿Me podrías confirmar tu interes por el modelo (nombre completo del modelo)?"

Ejemplo 2 de respuesta (más de 1 modelo en el listado):
"En las cilindradas solicitadas tenemos las siguientes opciones:
1. Modelo (nombre completo) marca (marca del modelo) a $ (precio del modelo) Catálogo: link catálogo
2. Modelo (nombre completo) marca (marca del modelo) a $ (precio del modelo) Catálogo: link catálogo
3.…
Los precios incluyen el patentamiento pero no el impuesto a los sellos de CABA y deberán ser confirmados por un vendedor.¿Me dirías cuál de estos modelos sería el de tu interes?"

Listado con las opciones y la información que hasta ahora no poseías:\n`;

export const financeInstructions = `Se ha detectado una palabra clave que está relacionada con la financiación como método de pago. La API ejecutó una función para brindarte estas instrucciones adicionales con información muy importante para asegurar tu respuesta correcta y cumplir con tus objetivos. Solicita el DNI y explíca que un vendedor hará la verificación para saber si califica para un crédito. NO estas autorizado a verificar si un cliente califica o no para un crédito o para hacer un cálculo de cuota; esto es trabajo del vendedor. Ejemplo de respuesta: "¿Podrías decirme tu número de DNI así un vendedor se encarga de verificar si calificas para un préstamo?"`;

export const cuotaInstructions = `Se ha detectado una palabra clave que está relacionada con el método de pago. La API ejecutó una función para brindarte estas instrucciones adicionales con información muy importante para asegurar tu respuesta correcta y cumplir con tus objetivos. El cliente está expresando que pretende pagar en cuotas. Pregunta al cliente si se trata de un préstamo o un pago con la tarjeta de crédito (esto será necesario para saber si necesitas solicitar el DNI). Ejemplo de respuesta: "¿Se trata de un préstamo o de un pago con tarjeta de crédito?"\n`;

export const pagoInstructions = `Se ha detectado una palabra clave que está relacionada con el método de pago. La API ejecutó una función para brindarte estas instrucciones adicionales con información muy importante para asegurar tu respuesta correcta y cumplir con tus objetivos. El cliente está expresando su método de pago para el cual no hace falta saber su DNI (no expliques esto al cliente). Si el cliente ya informó el modelo de interes con su nombre completo, puedes despedirte diciendole que será contactado en breve por un vendedor. Un número solo, ejemplo "110", o carácteres solos como "TRK" o "TNT" no pueden ser considerados como nombres de modelo completos.
Ejemplo 1 de respuesta (si el cliente ha confirmado previamente su modelo de interes con el nombre completo): "¡Gracias por confirmar tu método de pago! En breve seras contactado por un vendedor por la compra de tu modelo (nombre completo del modelo). ¡Que tengas un lindo día!"
Ejemplo 2 de respuesta (si el cliente aún no ha confirmado su modelo de interés): "¡Gracias por confirmar tu método de pago! ¿Me podrías informar tu modelo de interés así un vendedor luego te contacta?"\n`;

export const numbersInstructions = `Se ha detectado una palabra clave que puede estar relacionada con el DNI para solicitar un préstamo. La API ejecutó una función para brindarte estas instrucciones adicionales con información muy importante para asegurar tu respuesta correcta y cumplir con tus objetivos. Si el cliente envió el DNI y previamente ha confirmado o manifestado el modelo de interés con su nombre completo, aclara que un vendedor se encargará de verificar si califica para un crédito y puedes despedirte diciendo que un vendedor lo estará contactando a la brevedad. Un número solo, ejemplo "110", o carácteres solos como "TRK" o "TNT" no pueden ser considerados como nombres de modelo completos. NO estas autorizado a verificar si un cliente califica o no para un crédito o para hacer un cálculo de cuota; esto es trabajo del vendedor. 
Ejemplo Respuesta (si el cliente ha confirmado previamente el modelo de interes con su nombre completo): "¡Gracias por enviar tu DNI! Un vendedor se encargará de verificar si calificas para un préstamo y te estará contactando por la compra de tu modelo (nombre completo del modelo). ¡Que tengas un excelente día!".
Ejemplo Respuesta (si el cliente aún no confirmó su modelo de interés o si el nombre del mismo no es completo): "¡Gracias por enviar tu DNI! Un vendedor se encargará de verificar si calificas para un préstamo. ¿Podrías decirme cuál es tu modelo de interes?"\n`;

export const usedInstructions = `Se ha detectado una palabra clave que puede estar relacionada con la voluntad de comprar una moto usada. La API ejecutó una función para brindarte estas instrucciones adicionales con información muy importante para asegurar tu respuesta correcta y cumplir con tus objetivos. Si el cliente consulta por una moto usada, responde que Megamoto vende motos nuevas e intenta convencerlo sobre la conveniencia de comprar una moto nueva ya que en la actualidad no existe mucha diferencia de precios entre la usada y la nueva. También puedes hacer mención sobre la posibilidad de financiación para comprar una moto nueva.\n`;

export const bicicletaInstructions = `Se ha detectado una palabra clave que puede está relacionada con la voluntad del cliente de comprar una bicicleta. La API ejecutó una función para brindarte estas instrucciones adicionales con información muy importante para asegurar tu respuesta correcta y cumplir con tus objetivos. Responde que Megamoto comercializa bicicletas de las marcas Scott, Orbea, Tecnial y Shiro; y solicita al cliente que te envíe los detalles de lo que está buscando y que un vendedor lo estará contactando.\n`

export const trabajoInstructions = `Se ha detectado una palabra clave que puede está relacionada con la voluntad del cliente de postularse para un trabajo en Megamoto. La API ejecutó una función para brindarte estas instrucciones adicionales con información muy importante para asegurar tu respuesta correcta y cumplir con tus objetivos. Si el cliente está buscando trabajo responde que en estos momentos Megamoto no está contratando personal pero puede enviar su currículum por esta vía o a megamoto@megamoto.com.ar\n`;

export const enviosInstructions = `Se ha detectado una palabra clave que puede está relacionada con la voluntad del cliente de saber si Megamoto realiza envíos a domicilio. La API ejecutó una función para brindarte estas instrucciones adicionales con información muy importante para asegurar tu respuesta correcta y cumplir con tus objetivos. Si el cliente consulta por envíos al interior del país, responde que sí es posible y que los detalles sobre la metodología y costos asociados lo informará el vendedor.\n`;
<?php
/**
 * seed-runner.php — Auto-seeder de blog posts
 * Llamado por GitHub Actions después de cada deploy.
 * Protegido con clave derivada de las credenciales de DB (sin secret extra).
 * Idempotente: solo inserta posts que no existan por slug.
 */
require_once __DIR__ . '/config.php';
setCorsHeaders();

// ── Validar clave de seed ─────────────────────────────────────────────────────
$expectedKey = hash('sha256', DB_USER . ':' . DB_PASS);
$providedKey = $_SERVER['HTTP_X_SEED_KEY'] ?? ($_GET['key'] ?? '');
if ($providedKey !== $expectedKey) {
    http_response_code(403);
    echo json_encode(['error' => 'Forbidden']);
    exit;
}

// ── Asegurar columnas necesarias ──────────────────────────────────────────────
$db = getDB();
foreach (['author VARCHAR(255) NOT NULL DEFAULT ""', 'author_image TEXT NOT NULL DEFAULT ""'] as $col) {
    try { $db->exec("ALTER TABLE posts ADD COLUMN $col"); } catch (PDOException $e) {}
}

// ── Posts a sembrar ───────────────────────────────────────────────────────────
$posts = [

  // ── SERIE IA ────────────────────────────────────────────────────────────────
  [
    'title'    => 'IA en el Branding: ¿El Fin de la Creatividad Humana o su Evolución?',
    'slug'     => 'ia-branding-creatividad-humana-evolucion',
    'category' => 'Branding',
    'image'    => 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80&auto=format&fit=crop',
    'keywords' => 'inteligencia artificial, branding, IA creativa, identidad de marca, diseño generativo',
    'excerpt'  => 'Midjourney genera logos. ChatGPT escribe manifiestos de marca. Sora produce videos de campaña. ¿Qué le queda al diseñador humano? La respuesta te va a sorprender.',
    'content'  => <<<MD
# IA en el Branding: ¿El Fin de la Creatividad Humana o su Evolución?

En 2023, una agencia de Tokio ganó un premio internacional de diseño con una campaña cuya identidad visual fue generada completamente por IA. El cliente era real. La emoción era real. El impacto, también. La pregunta inevitable llegó después: **¿para qué necesitamos diseñadores?**

La respuesta no es simple, y quienes la simplifican en cualquier dirección —"la IA nos reemplazará" o "la IA no puede ser creativa"— están perdiendo el punto central.

## Lo que la IA realmente puede hacer en branding

**Generación visual a escala**: Midjourney, DALL-E y Stable Diffusion pueden producir cientos de variaciones de un concepto visual en minutos. Lo que antes tomaba semanas de iteración entre diseñador y cliente, ahora puede resolverse en horas de exploración.

**Escritura de territorio de marca**: Los modelos de lenguaje pueden generar manifiestos, taglines, naming de productos y tono de voz a una velocidad y variedad imposible para un equipo humano. *No reemplazan el criterio*, pero multiplican las opciones.

**Análisis de identidad competitiva**: La IA puede analizar miles de marcas en un sector en segundos, identificar patrones visuales saturados, oportunidades de diferenciación y tendencias emergentes.

## Lo que la IA no puede hacer (todavía)

> *"La IA produce resultados. Los humanos producen significado."*

La brecha más profunda entre la creatividad humana y la generación artificial no está en la calidad técnica —que ya es asombrosa— sino en la **intencionalidad estratégica**.

Una IA puede generar mil variaciones de un logo. No puede preguntarte por qué tu empresa existe, qué promesa estás haciendo al mundo y cómo esa promesa debe sobrevivir en un mercado que cambiará en cinco años.

Tampoco puede:
- Sentarse con el fundador de una empresa y entender su historia real
- Detectar que el "azul corporativo" que el cliente ama tiene una connotación negativa en su mercado
- Construir confianza con un equipo directivo que necesita ser contradecido cuando está equivocado

## La nueva jerarquía del trabajo creativo

Lo que está emergiendo no es el reemplazo del diseñador, sino una **nueva división del trabajo**:

**La IA hace**: exploración, iteración, producción técnica, variaciones, adaptaciones, análisis de datos visuales.

**El estratega hace**: definición del problema, criterio de selección, narrativa de marca, validación cultural, gobernanza de identidad.

Esta división no elimina roles: los transforma. El diseñador del futuro no es el que dibuja mejor, sino el que **hace las preguntas correctas a las herramientas correctas** y tiene el criterio para elegir qué vale la pena.

## Cómo incorporar IA en tu proceso de branding hoy

**1. Exploración conceptual acelerada**: Usa herramientas generativas para mapear el territorio visual antes de comprometerte con una dirección. Genera 50 conceptos en lugar de 5.

**2. Naming y territory verbal**: Usa LLMs para generar cientos de opciones de nombre, tagline y mensajes clave. Filtra con criterio estratégico humano.

**3. Análisis de benchmark**: Pide a la IA que analice las marcas de tu competencia y te señale los arquetipos visuales más usados. Lo que más se repite es lo que debes evitar.

**4. Producción de adaptaciones**: Una vez definida la identidad, usa IA para producir adaptaciones a diferentes formatos, canales y contextos.

---

*En PlanoZero integramos IA en nuestros procesos de branding sin perder el pensamiento estratégico que hace que las marcas perduren. [Hablemos de tu proyecto](/contacto).*
MD,
  ],

  [
    'title'    => 'IA y UX: Cómo la Inteligencia Artificial está Rediseñando la Experiencia de Usuario',
    'slug'     => 'ia-ux-inteligencia-artificial-experiencia-usuario',
    'category' => 'Diseño UX',
    'image'    => 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80&auto=format&fit=crop',
    'keywords' => 'IA en UX, inteligencia artificial, experiencia de usuario, personalización, diseño adaptativo, interfaces inteligentes',
    'excerpt'  => 'Las interfaces que aprenden de ti, se adaptan a tu comportamiento y anticipan lo que necesitas antes de que lo pidas. Esto ya no es ciencia ficción: es el nuevo estándar del diseño UX.',
    'content'  => <<<MD
# IA y UX: Cómo la Inteligencia Artificial está Rediseñando la Experiencia de Usuario

Hace diez años, el diseño UX significaba crear interfaces consistentes y predecibles. El objetivo era que todos los usuarios tuvieran la misma experiencia de calidad. Hoy, el nuevo estándar es exactamente lo opuesto: **que cada usuario tenga una experiencia diferente**, optimizada para su comportamiento, contexto y necesidades específicas.

## Personalización en tiempo real: más allá de "usuarios frecuentes"

Los sistemas actuales de IA pueden:

- **Reorganizar la arquitectura de información** de una app según el patrón de uso individual
- **Ajustar el nivel de complejidad** de la interfaz según el perfil del usuario
- **Predecir la próxima acción** y pre-cargar la opción más probable, reduciendo la fricción antes de que el usuario la sienta

Netflix estima que su sistema de recomendación genera **$1 billón de dólares anuales** en retención de usuarios que de otra forma habrían cancelado su suscripción.

## Research de UX aumentado por IA

La IA no elimina el research: lo **comprime y escala** de formas que antes eran imposibles.

**Análisis de sesiones masivo**: Herramientas como Microsoft Clarity con IA pueden analizar miles de sesiones simultáneamente, identificar patrones de fricción y señalar exactamente en qué punto los usuarios abandonan.

**Síntesis de entrevistas**: Los LLMs procesan 50 transcripciones de entrevistas en minutos y extraen los temas recurrentes, las frustraciones principales y las oportunidades no articuladas.

**Testing predictivo**: Algunos sistemas predicen —antes de llegar a usuarios reales— qué elementos van a generar confusión, basándose en modelos entrenados con millones de interacciones previas.

## Interfaces que se adaptan al contexto

> *"El mejor diseño es el que no se nota porque siempre muestra exactamente lo que necesitas en el momento exacto."*

La IA permite interfaces **contextuales** de formas que el diseño estático nunca pudo:

- Un dashboard financiero que muestra datos de cierre el último día del mes y proyecciones el primero del siguiente
- Una app que reduce opciones cuando detecta al usuario en movimiento (scroll acelerado, batería baja)
- Formularios que eliminan campos irrelevantes en tiempo real según respuestas anteriores

## Accesibilidad aumentada con IA

Una de las aplicaciones más poderosas —y menos discutidas— de la IA en UX:

- Generación automática de texto alternativo para imágenes
- Simplificación de lenguaje para usuarios con dislexia o baja alfabetización
- Detección de patrones de navegación que sugieren dificultades de motricidad y activación de modos adaptados

---

*Diseñamos experiencias digitales que integran IA de forma ética, efectiva y centrada en el usuario real. [Cuéntanos tu proyecto](/contacto).*
MD,
  ],

  [
    'title'    => 'SEO en la Era de la IA: Lo que Google ya Sabe y Tú Todavía No',
    'slug'     => 'seo-era-ia-google-inteligencia-artificial',
    'category' => 'SEO',
    'image'    => 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=1200&q=80&auto=format&fit=crop',
    'keywords' => 'SEO inteligencia artificial, Google SGE, IA en SEO, Search Generative Experience, contenido IA, ranking Google',
    'excerpt'  => 'Google procesa búsquedas con IA desde hace años. Pero con SGE y Gemini integrado, las reglas del SEO cambiaron completamente. Aquí está lo que funciona ahora.',
    'content'  => <<<MD
# SEO en la Era de la IA: Lo que Google ya Sabe y Tú Todavía No

Google usa inteligencia artificial en su algoritmo desde 2015 con RankBrain. En 2019 llegó BERT. En 2021, MUM. Pero nada preparó a la industria del SEO para la integración de modelos generativos directamente en los resultados de búsqueda.

La pregunta ya no es cómo optimizar para Google. Es **si Google seguirá siendo el canal principal de descubrimiento** cuando los usuarios pueden preguntar directamente a la IA.

## El nuevo landscape del search

La Search Generative Experience (SGE) —y su evolución hacia AI Overviews— representa el cambio más profundo en la búsqueda desde los snippets destacados.

Cuando un usuario busca una pregunta informacional, Google genera una respuesta completa sin necesidad de clic. Las implicancias son masivas:

- El **tráfico informacional** se está reduciendo para sitios que dependían de capturar esas búsquedas
- Las **búsquedas transaccionales** siguen siendo resistentes: cuando alguien quiere comprar algo, Google todavía lleva a sitios
- El **contenido de autoridad original** —investigaciones propias, datos exclusivos, perspectivas de expertos— es lo que Google cita como fuente

## Lo que sí funciona en el SEO actual

**E-E-A-T llevado al extremo**: Experience, Expertise, Authoritativeness, Trustworthiness son ahora el filtro principal. Los autores necesitan perfiles verificables, historial de publicaciones, citaciones de terceros.

**Contenido que responde preguntas que la IA no puede responder**: Perspectivas originales basadas en experiencia real. Casos de estudio con datos propios. Opiniones respaldadas por trabajo de campo.

**Optimización para fragmentos citables**: Estructurar contenido con definiciones claras, listas enumeradas y respuestas directas aumenta la probabilidad de ser citado en AI Overviews.

## Lo que está perjudicando tu SEO sin que lo sepas

> *"El contenido generado con IA que no aporta perspectiva original no solo no rankea: activamente daña la autoridad del dominio."*

Desde Helpful Content Update (2023), Google penaliza activamente:

- Artículos que resumen información disponible en otras páginas sin agregar perspectiva original
- Contenido optimizado para algoritmos, no para humanos
- Páginas sin señales de experiencia real: sin autor identificable, sin datos propios, sin perspectiva de primera mano

## La oportunidad real de la IA en SEO

**Research de keywords semántico**: Los LLMs identifican clusters de intención de búsqueda con profundidad que las herramientas tradicionales no alcanzan.

**Análisis de brechas de contenido**: IA para identificar qué preguntas de tu audiencia no están respondidas adecuadamente en ningún sitio de tu sector.

**Optimización técnica automatizada**: Meta descriptions, structured data, texto alternativo y etiquetado semántico a escala.

---

*Construimos estrategias SEO que funcionan en el mundo post-IA: contenido de autoridad real, optimización técnica impecable. [Conversemos](/contacto).*
MD,
  ],

  [
    'title'    => 'IA en SEM: El Fin de las Campañas Manuales y el Nacimiento de la Publicidad Predictiva',
    'slug'     => 'ia-sem-campanas-publicidad-predictiva',
    'category' => 'Marketing Digital',
    'image'    => 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80&auto=format&fit=crop',
    'keywords' => 'SEM inteligencia artificial, Google Ads IA, publicidad programática, Performance Max, smart bidding, campañas automatizadas',
    'excerpt'  => 'Google Ads ya toma más decisiones de puja que cualquier humano. Meta Ads construye audiencias que ningún analista podría definir manualmente. El SEM cambió: los que no lo entienden están quemando presupuesto.',
    'content'  => <<<MD
# IA en SEM: El Fin de las Campañas Manuales y el Nacimiento de la Publicidad Predictiva

En 2019, un especialista en Google Ads pasaba su día ajustando pujas manualmente por keyword, hora, dispositivo y ubicación. En 2025, ese trabajo lo hace un algoritmo en microsegundos, procesando miles de señales simultáneas que ningún humano podría analizar en tiempo real.

El SEM cambió fundamentalmente. Los que no lo han entendido aún siguen optimizando campañas del siglo pasado.

## Cómo la IA transformó Google Ads

### Smart Bidding: el cerebro detrás de cada subasta

Smart Bidding usa machine learning para optimizar pujas en tiempo real considerando:

- **Señales de usuario**: historial de búsqueda, comportamiento en sitios de la red de Google, intención detectada
- **Señales contextuales**: dispositivo, hora, ubicación, idioma, la query exacta vs. el keyword
- **Señales de cuenta**: historial de conversiones, valor promedio de cliente, patrones estacionales

El resultado: un sistema que paga más por un usuario con alta probabilidad de conversión y menos por uno con baja intención, en tiempo real, por cada subasta individual.

### Performance Max: la campaña que gestiona todo

PMax corre en Search, Display, YouTube, Gmail, Maps y Discovery simultáneamente. El algoritmo decide dónde y cómo mostrar cada anuncio.

**Lo que funciona en PMax**:
- Assets creativos de alta calidad y variedad
- Señales de audiencia claras (listas de clientes, segmentos de visitantes)
- Suficiente historial de conversiones para que el algoritmo aprenda
- Objetivos de conversión bien definidos

**Lo que destruye PMax**:
- Assets genéricos o de baja calidad
- Objetivos de conversión mal configurados
- Presupuestos demasiado bajos para completar el período de aprendizaje

## IA en Meta Ads: audiencias que ningún humano definiría

> *"Las Advantage+ Audiences de Meta encuentran tu cliente ideal en 2 mil millones de personas. El targeting manual limitaba ese espacio innecesariamente."*

Meta pasó de que el anunciante defina audiencias detalladas (intereses, comportamientos, demografías) a un modelo donde la IA encuentra las audiencias más propensas a convertir, basándose únicamente en datos de conversión histórica.

Las **Advantage+ Shopping Campaigns** han demostrado eficiencia superior a las campañas manuales equivalentes en la mayoría de los casos documentados.

## El nuevo rol del especialista en SEM

Se convierte en **arquitecto de sistemas de conversión**:

**Estrategia de objetivos**: Definir exactamente qué es una conversión valiosa. Una campaña optimizada para leads de baja calidad producirá exactamente eso.

**Gestión de señales**: Proporcionar al algoritmo la mejor información posible: listas de clientes, integraciones de CRM, customer match, datos de valor de vida del cliente.

**Creatividad y messaging**: La variable que los algoritmos no pueden optimizar. El copy, el valor propuesto, la promesa creativa: esto sigue siendo 100% humano.

---

*Gestionamos campañas SEM que aprovechan la IA de las plataformas con estrategia clara y criterio analítico. Sin cajas negras, sin presupuesto quemado. [Hablemos](/contacto).*
MD,
  ],

  [
    'title'    => 'Diseño Web con IA: Páginas Más Inteligentes, Más Rápidas y Más Humanas',
    'slug'     => 'diseno-web-ia-paginas-inteligentes-modernas',
    'category' => 'Estrategia',
    'image'    => 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80&auto=format&fit=crop',
    'keywords' => 'diseño web inteligencia artificial, IA en desarrollo web, páginas web modernas, UX con IA, web generativa, Figma AI',
    'excerpt'  => 'El diseño web ya no empieza con un lienzo en blanco. Empieza con datos, comportamientos y modelos de IA que saben lo que tu usuario necesita antes de que te lo diga. Así es el proceso en 2025.',
    'content'  => <<<MD
# Diseño Web con IA: Páginas Más Inteligentes, Más Rápidas y Más Humanas

Hubo un tiempo en que una web era un folleto digital. Luego fue una plataforma interactiva. Hoy, la web más avanzada es un sistema que **observa, aprende y se adapta** en tiempo real al comportamiento de cada visitante.

## El proceso de diseño web aumentado por IA

### Investigación y estrategia

Antes de diseñar una línea, la IA puede hacer en horas lo que antes tomaba semanas:

**Análisis de competencia automatizado**: Scraping y análisis visual de decenas de sitios del sector, identificando patrones de layout, paletas dominantes y estructuras de navegación más usadas.

**Síntesis de investigación de usuarios**: Los LLMs procesan encuestas, reviews de Google, comentarios en redes sociales y transcripciones de entrevistas para extraer patrones de necesidades y frustraciones.

**Mapas de calor predictivos**: Herramientas como Attention Insight predicen dónde van a mirar los usuarios en un diseño *antes de publicarlo*, usando modelos entrenados con datos de eye-tracking real.

### Diseño y prototipado

Figma integró IA nativa en 2024. Adobe integró Firefly en todo su ecosistema:

- Los **sistemas de diseño se generan automáticamente** a partir de una guía de marca existente
- El **contenido placeholder es contextualmente relevante** desde el primer wireframe
- Las **variantes de componentes** se generan en segundos para testear diferentes enfoques

**La advertencia**: La IA genera. El diseñador decide. La diferencia entre un sitio generado por IA y un sitio *diseñado con* IA está en la capa de criterio humano que filtra y da coherencia al resultado.

### Desarrollo y performance

**Generación de código desde diseño**: GitHub Copilot, v0 de Vercel y Builder.io transforman un diseño de Figma en código funcional en React, Vue o HTML/CSS en minutos.

**Optimización automática**: Sistemas de IA analizan el código, identifican cuellos de botella de rendimiento y sugieren optimizaciones específicas para Core Web Vitals.

## El nuevo estándar: webs adaptativas

> *"Una web que muestra lo mismo a todos los usuarios es un desperdicio masivo de oportunidades de conversión."*

El siguiente nivel no es solo crear sitios más rápido: es crear sitios que **cambian según quien los visita**:

- **Hero sections dinámicas**: titular, imagen y CTA cambian según el segmento detectado (nuevo visitante, cliente recurrente, fuente de tráfico)
- **Pricing contextual**: para B2B, el sitio muestra casos de estudio específicos según el sector de la empresa visitante
- **Chatbots contextuales**: no el genérico que responde lo mismo a todos, sino uno que sabe qué páginas visitó y cuánto tiempo pasó en cada sección

## Lo que no cambia

**El punto de vista**: Un sitio web comunica una perspectiva, una personalidad. La IA puede ejecutarla; no puede originarla.

**La confianza**: Los usuarios perciben cuando un sitio fue construido con cuidado genuino versus generado industrialmente.

**La estrategia de negocio**: El mejor sitio es el que resuelve el problema de negocio correcto. Eso sigue siendo trabajo estratégico humano.

---

*Diseñamos y desarrollamos sitios web que combinan lo mejor de la IA con el pensamiento estratégico humano. [Cuéntanos qué necesitas](/contacto).*
MD,
  ],

];

// ── Insertar posts idempotentemente ──────────────────────────────────────────
$inserted = 0;
$skipped  = 0;
$errors   = [];

$checkStmt = $db->prepare('SELECT COUNT(*) FROM posts WHERE slug = ?');
$insertStmt = $db->prepare('
    INSERT INTO posts
        (id, title, slug, content, excerpt, category, image, keywords, published,
         author, author_image, author_id, author_email, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?)
');

foreach ($posts as $post) {
    try {
        $checkStmt->execute([$post['slug']]);
        if ($checkStmt->fetchColumn() > 0) {
            $skipped++;
            continue;
        }

        $now = nowISO();
        $insertStmt->execute([
            generateId(),
            $post['title'],
            $post['slug'],
            $post['content'],
            $post['excerpt'],
            $post['category'],
            $post['image'],
            $post['keywords'],
            'Raúl Mella',
            'https://lh3.googleusercontent.com/a/ACg8ocJUy69CHl0ImOqCAnQoRaBAS6xxNUHK3h3YcLgR2pE0LArgAjJ_=s96-c',
            ADMIN_UID,
            ADMIN_EMAIL,
            $now,
            $now,
        ]);
        $inserted++;
    } catch (PDOException $e) {
        $errors[] = $post['slug'] . ': ' . $e->getMessage();
    }
}

jsonOk([
    'inserted' => $inserted,
    'skipped'  => $skipped,
    'errors'   => $errors,
    'total'    => count($posts),
]);

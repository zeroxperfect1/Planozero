import React from 'react';
import { ServicePage } from './ServiceLayout';

export default function ServiceBranding() {
  return (
    <ServicePage
      title="Agencia de Branding"
      metaTitle="Agencia de Branding en Santiago, Chile | PLANOZERO"
      metaDescription="PLANOZERO es una agencia de branding en Santiago, Chile. Construimos identidades visuales con coherencia real: auditoría de marca, sistema visual, posicionamiento y narrativa."
      canonical="https://www.planozero.cl/agencia-branding"
      schemaService="Servicio de Branding y Identidad Visual"
      tag="Branding · Identidad Visual · Santiago, Chile"
      heroBg="/service-branding.jpg"
      headline={
        <>
          Tu marca<br />
          <span className="text-[#FF5F1F]">merece más que un logo</span>
        </>
      }
      subheadline="Construimos marcas desde lo que son, no desde lo que quisieran parecer. Identidad visual, posicionamiento y sistema de marca para empresas que quieren durar."
      intro={
        <>
          <p>
            El branding no es un logo y una paleta de colores. Es la diferencia entre que alguien recuerde tu empresa o que la confunda con cualquier otra del mercado. Y esa diferencia, que parece intangible, tiene consecuencias muy concretas en cómo se vende, cómo se cobra y cómo se crece.
          </p>
          <p>
            Trabajamos con empresas que están construyendo su marca por primera vez, con negocios que crecieron y se dieron cuenta de que su identidad no los representa más, y con startups que necesitan proyectar credibilidad antes de tener el historial para respaldarla. En todos los casos, el proceso empieza igual: entendiendo qué hace diferente a ese negocio y por qué alguien debería elegirlo.
          </p>
          <p>
            No creemos en el diseño decorativo. Cada decisión visual tiene una razón estratégica detrás. Un color no se elige porque se ve bien — se elige porque comunica algo específico al segmento correcto.
          </p>
        </>
      }
      points={[
        {
          title: 'Auditoría de Marca',
          desc: 'Antes de diseñar nada, revisamos cómo está la marca hoy: percepción, consistencia, comparación con competidores directos y posicionamiento real versus deseado. Sin este paso, cualquier rediseño es un tiro al aire.'
        },
        {
          title: 'Estrategia de Posicionamiento',
          desc: 'Definimos qué lugar ocupa la marca en la mente del cliente, qué la diferencia de manera genuina y cómo comunicar eso de forma que sea creíble y consistente en todos los puntos de contacto.'
        },
        {
          title: 'Identidad Visual',
          desc: 'Logo, tipografía, paleta de colores, sistema de iconografía y todos los elementos que hacen reconocible a una marca. Diseñados para funcionar en cualquier soporte — digital, impreso, packaging, señalética.'
        },
        {
          title: 'Sistema de Marca',
          desc: 'Las reglas de uso que hacen que la identidad sea consistente aunque la apliquen personas distintas. Brandbook completo, documentación técnica y guías de aplicación para los casos más comunes.'
        },
        {
          title: 'Narrativa y Voz de Marca',
          desc: 'El tono, el estilo de comunicación y los mensajes clave que definen cómo habla la marca. Porque una identidad visual sin una voz coherente es solo estética.'
        },
        {
          title: 'Materiales de Aplicación',
          desc: 'Presentaciones corporativas, papelería, piezas digitales y cualquier material donde la marca tenga que estar presente. Diseñados siguiendo el sistema, no adaptados a último momento.'
        },
      ]}
      process={[
        {
          num: '01',
          title: 'Inmersión',
          desc: 'Conocemos el negocio en profundidad. Sus clientes, su competencia, sus valores reales (no los de la misión/visión de la web), sus aspiraciones y las restricciones del mercado. Este proceso puede incluir entrevistas con el equipo y, en algunos casos, con clientes actuales.'
        },
        {
          num: '02',
          title: 'Estrategia',
          desc: 'Definimos el posicionamiento, los atributos de marca y el perfil del cliente ideal. Entregamos un documento estratégico que guía todo lo que viene después — y que tiene que ser aprobado antes de pasar al diseño.'
        },
        {
          num: '03',
          title: 'Exploración visual',
          desc: 'Presentamos direcciones visuales distintas — no tres variantes del mismo concepto. Cada dirección responde a la estrategia de una manera diferente. Aquí el cliente elige el camino, no el resultado final.'
        },
        {
          num: '04',
          title: 'Desarrollo',
          desc: 'Construimos el sistema completo sobre la dirección elegida. Logo en todas sus versiones, paleta completa, tipografías, patrones y todos los elementos del sistema visual.'
        },
        {
          num: '05',
          title: 'Entrega y manual',
          desc: 'Archivos en todos los formatos necesarios, manual de marca completo y sesión de entrega donde explicamos las decisiones y cómo aplicar el sistema. No entregamos y desaparecemos.'
        },
      ]}
      faqs={[
        {
          q: '¿Cuánto tiempo toma un proyecto de branding?',
          a: 'Un proyecto de identidad completo toma entre 6 y 10 semanas según el alcance. Proyectos que incluyen estrategia de posicionamiento profunda o investigación con clientes pueden tomar más. Siempre definimos el cronograma real al inicio — no prometemos plazos imposibles para cerrar el proyecto.'
        },
        {
          q: '¿Hacen rebrandings o solo marcas nuevas?',
          a: 'Los dos. De hecho, los rebrandings son frecuentes. Empresas que crecieron, que cambiaron de segmento o que simplemente se dieron cuenta de que su marca no los representa más. En esos casos hacemos una auditoría primero para entender qué vale la pena conservar y qué hay que transformar.'
        },
        {
          q: '¿Trabajamos solo con empresas de cierto tamaño?',
          a: 'No. Trabajamos con startups que están lanzando, PYMES que quieren crecer y empresas medianas que necesitan evolucionar su marca. El tamaño no define si podemos ayudar — el estado del negocio y la claridad sobre lo que quieren lograr sí.'
        },
        {
          q: '¿Qué entregables incluye el proyecto?',
          a: 'Logo en vectores (AI, EPS, SVG, PDF) y PNG con fondos transparentes. Manual de marca en PDF. Archivos editables en los programas que usa el equipo. Paleta de colores con códigos HEX, RGB y CMYK. Todo lo que se necesita para aplicar la marca sin necesidad de contactarnos para cada uso.'
        },
        {
          q: '¿Incluye el desarrollo del sitio web?',
          a: 'El branding como servicio termina en la identidad visual y el sistema de marca. El desarrollo del sitio es un proyecto separado, aunque lo hacemos habitualmente como continuación. Trabajar los dos juntos tiene ventajas evidentes de coherencia, pero no es obligatorio.'
        },
      ]}
      faqSchema={[
        { q: '¿Cuánto tiempo toma un proyecto de branding?', a: 'Un proyecto de identidad completo toma entre 6 y 10 semanas según el alcance.' },
        { q: '¿Hacen rebrandings o solo marcas nuevas?', a: 'Los dos. En rebrandings hacemos una auditoría primero para entender qué vale la pena conservar.' },
        { q: '¿Qué entregables incluye el proyecto?', a: 'Logo en vectores, manual de marca en PDF, archivos editables y paleta de colores con todos los códigos.' },
        { q: '¿Incluye el desarrollo del sitio web?', a: 'El branding termina en la identidad visual. El desarrollo web es un proyecto separado que hacemos habitualmente como continuación.' },
      ]}
      relatedLinks={[
        { label: 'Diseño UX/UI',          href: '/diseno-ux-ui' },
        { label: 'Diseño Web',             href: '/diseno-web' },
        { label: 'Marketing Digital',      href: '/agencia-marketing-digital' },
      ]}
    />
  );
}
